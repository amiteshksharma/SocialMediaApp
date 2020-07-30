const express = require('express');
const functions = require('firebase-functions');
const tools = require('firebase-tools');
const firebase = require('firebase');
const admin = require('firebase-admin');
const cors = require("cors");

const db = admin.firestore();
const router = express.Router();
router.use(cors());

/**
 * Creates a post for the user, and adds to the database
 */
router.post('/create', function(req, res, next) {
  //Get the paramters from the POST request
  const title = req.body.title;
  const body = req.body.body;

  //Check if the user is logged in
  firebase.auth().onAuthStateChanged( (user) => {
    if(user) {
      //Add the post to the database
      db.collection("user").doc(user.uid).collection("posts").doc(title).set({
        Title: title,
        Body: body,
      }).then(function() {
        //Send success status if the post is added to database
        return res.status(200).send("Success");
      }).catch(function(error) {
        console.error("Error writing document: ", error);
        return res.status(404).send("Error");
      });
    } else{
        return res.status(500).send("Error! User not signed in!");
    }
  });
  
});

/**
 * Method used for loading the profile page. Takes the parameter :email
 * from the url to load all posts of the specific user
 */
router.get('/posts/:email', function(req, res, next) {
  //Get the email from the url
  const name = req.params.email;
  (async () => {
      try {
        //Get the user from the database by name
        admin.auth().getUserByEmail(name)
        .then(async function(userRecord) {
          //Convert record to JSON
          const user = userRecord.toJSON();
          //Get all posts for the user
          const value = await db.collection('user').doc(user.uid).collection('posts').get();
          //Get the name and email of the user
          const name = await db.collection('user').doc(user.uid).get();
          
          //Check if the user has no posts
          if(value.docs !== undefined) {
            //Map each post for the user
            const array = value.docs.map(doc => {
              //Add name to the object
              const obj = doc.data();
              obj.Name = name.data().Name;
              obj.Email = name.data().Email;
              return obj;
            });
            //Return array to frontend
            return res.send(array);
          } else {
            return res.send([]);
          }
        })
          .catch(function(error) {
          console.log('Error fetching user data:', error);
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});

/**
 * Load all the posts for all users in the database
 * Used for the Search page
 */
router.get('/loadposts', (req, res, next) => {
  let uidList = [];
  async function getAllPosts() {
    //Get all the UIDs
    uidList = await getUid();
    let getAllPosts = [];

    //Loop through each uid
    for(let uid of uidList) {
      let getPosts = await getBlogPosts(uid);
      //Loop through each post and push to array
      for(let post of getPosts) {
        getAllPosts.push(post);
      }
    }
  
    return res.status(200).send(getAllPosts);
  }

  //Return the array after the first async runs
  (async () => {
    return await getAllPosts();
  })();
})

/**
 * Adds a like to the post that was liked
 */
router.post('/postlike', function(req, res, next) {
  //Get the current user, the email of the user, and title of post
  const currUserEmail = req.body.currentEmail;
  const getEmail = req.body.email;
  const getTitle = req.body.title;
  
  (async () => {
    //Add the like to the current user's account
    const addLike = await addLikeToAccount(currUserEmail, getTitle, getEmail);
    //Add the like to the account of the post
    admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
      //Get his information
      const userInfo = userRecord.toJSON();
      const currUserInfo = await getUidOfUser(currUserEmail);
      //Add the document to database
      const likePath = await db.collection('user').doc(userInfo.uid).collection('posts').doc(getTitle)
        .collection('likes').doc(currUserInfo.uid).set({
          Uid: currUserInfo.uid,
          Name: currUserInfo.displayName,
          Email: currUserInfo.email 
        }).then(() => {
          //Return the phrase "liked" if successful
          return res.send("liked");
        }).catch(error => {
          //Return the error if any error
          return res.send(error);
        })
    })
    .catch(error => {
      console.log(error);
    })
  })();  
});

/**
 * Get all the likes of the current user. Return an array of the post 
 * titles the user Has liked
 */
router.post('/mylikes', (req, res, next) => {
  //Get Email of user
  const getEmail = req.body.email;
  //Array of titles to send back to frontend
  let getLikesTitle = [];
  (async () => {
    //Get the user's uid 
    admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
      //Convert data to JSON and get the Uid
      const userInfo = userRecord.toJSON();
      const getUid = userInfo.uid;

      //Get the likes collection from the user
      const getLikes = await db.collection('user').doc(getUid).collection('likes').get();
      //Get all titles from the collection
      getLikes.forEach(doc => {
        getLikesTitle.push(doc.id);  
      })

      return res.send(getLikesTitle);
    }).catch(error => {
      //Catch any error that occurs
      console.log(error);
    })
  })();
})

/**
 * Unlikes the post and removes from the database accordingly.
 * Only affects the current User
 */
router.post('/unlike', (req, res, next) => {
  //Get the user's email
  const getCurrEmail = req.body.currEmail;
  //Email of the user who created the post
  const getEmail = req.body.email;
  //Title of the post to unlike
  const getTitle = req.body.title;

  (async () => {
    admin.auth().getUserByEmail(getCurrEmail).then(async (userRecord) => {
      //Get the current user's uid
      const userInfo = userRecord.toJSON();
      const getUid = userInfo.uid;

      //Unlike from the current user's likes collection
      const unLike = await db.collection('user').doc(getUid).collection('likes').doc(getTitle).delete().then(() => {
        // return res.status(204).send("Unliked!");
        console.log("unliked");
      }).catch(error => {
        console.log(error);
      })

      //Get the uid of the author of post
      const postUid = await getUidOfUser(getEmail);
      //Remove the like from his post in the posts collection
      const unLikeFromPost = await db.collection('user').doc(postUid.uid).collection('posts').doc(getTitle).collection('likes').doc(getUid).delete().then(() => {
        console.log("deleted from post");
      }).catch(error => {
        console.log(error);
      });

      return res.send("Unliked");
    })
  })();
})

/**
 * Returns the total number of likes on a post  
 */
router.post('/loadlikes', (req, res, next) => {
  //Get the email of the user for the post
  const getEmail = req.body.email;
  //Get the title of the post
  const getTitle = req.body.title;
  
  (async () => {
    admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
      //Get the user's uid
      const userInfo = userRecord.toJSON();
      const uid = userInfo.uid;

      //Get the total number of users under the 'likes' collection
      const likes = await db.collection('user').doc(uid).collection('posts')
      .doc(getTitle).collection('likes').get();
      //Return the total number of likes
      return res.send({Likes: likes.size});
    }).catch(error => {
      console.log(error)
    })
  })();
})

/**
 * Follows the user the current user clicks 'follow' on.
 * Adds the follower to the current user's 'following' and
 * to the profile user's 'follower' 
 */
router.post('/followlist', (req, res, next) => {
  //Get the email of current user
  const email = req.body.email;
  (async () => {
    admin.auth().getUserByEmail(email).then(async (userRecord) => {
      const user = userRecord.toJSON();
      
      //Get all the profiles the current user is following
      //Gets only the email of each user
      const value = await db.collection('user').doc(user.uid).collection('following').get();
      let arr = [];
      value.forEach(following => {
        arr.push(following.data().Email);  
      })

      return res.send(arr);
    }).catch(error => {
      console.log(error);
    })
  })();
})

/**
 * Method used for getting all the profile user's 
 * followers and following
 */
router.post('/loadprofile', (req, res, next) => {
  //Email of the profile user
  const email = req.body.email;
  //A keyword that is either "followers" or "following"
  const follow = req.body.follow;
  (async () => {
    admin.auth().getUserByEmail(email).then(async (userRecord) => {
      const user = userRecord.toJSON();

      //Load all the users in the collection specficied by the keyword
      const value = await db.collection('user').doc(user.uid).collection(follow).get();
      let arr = [];
      //Push the emails into the array to return back to frontend
      value.forEach(following => {
        arr.push(following.data().Email);  
      })

      return res.send(arr);
    }).catch(error => {
      console.log(error);
    })
  })();
})

/**
 * Get the post details to use for the Post.js page
 */
router.post('/getpost', (req, res, next) => {
  //Get the user's email and title from the fetch
  const email = req.body.email;
  const title = req.body.title;

  (async () => {
    //Get the uid of the user
    const uid = await getUidOfUser(email);

    //Get the user's name
    const getName = await db.collection('user').doc(uid.uid).get();
    //Get the details of the specific post
    const getPost = await db.collection('user').doc(uid.uid).collection('posts').doc(title).get();

    //Assign it to an object and push it
    let obj = {};
    obj.name = getName.data().Name;
    obj.post = getPost.data();

    //Return the object containing the post and name
    return res.send(obj);
  })()
})

/**
 * Gets all the comments under a single post
 */
router.post('/getcomment', (req, res, next) => {
  //Takes in an email and title of the post
  const email = req.body.email;
  const title = req.body.title;

  (async () => {
    //Get the uid of the user
    const uid = await getUidOfUser(email);

    //get the comments to the specific post
    const setComment = await db.collection('user').doc(uid.uid).collection('posts')
    .doc(title).collection('comment').get();

    //initialize and array storing all the comment data
    let comments = [];
    setComment.forEach(comment => {
      comments.push(comment.data())
    })

    //Return the array of comments
    return res.send(comments);
  })()
})

/**
 * Adds comment to a post
 */
router.post('/comment', (req, res, next) => {
  //Takes in the currUser's email, the email and title of post, 
  //And comment from the currUser
  const userEmail = req.body.userEmail;
  const email = req.body.email;
  const title = req.body.title;
  const comment = req.body.comments;

  (async () => {
    //Get the uid of the user
    const uid = await getUidOfUser(email);
    //Get the uid of the current user
    const currUid = await getUidOfUser(userEmail);

    //set the comment to the specific post
    const setComment = await db.collection('user').doc(uid.uid).collection('posts')
    .doc(title).collection('comment').doc(makeid()).set({
      Name: currUid.displayName,
      Comment: comment 
    });

    //Return true if it works
    return res.send(true);
  })()
})

/**
 * -----------------------------------------
 * BEGINNING OF HELPER METHODS FOR THIS FILE
 * -----------------------------------------
 */

/**
* Method to generate a random String to store comments in the database
*/
function makeid() {
  var result = '';
  //The characters to select from
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  //Loop through the characters and get a random char and append to 'results
  for ( var i = 0; i < 15; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Return the uid of the email that is passed
 * @param {String} email Used to get the uid of the user
 */
async function getUidOfUser(email) {
  return admin.auth().getUserByEmail(email).then(async (userRecord) => {
    const user = userRecord.toJSON();
    //Store the user's uid
    return user;
  })
}

/**
 * Get the uid of the current user to add the post to his likes
 * @param {String} currUserEmail current user's email
 * @param {String} getTitle Title of the post
 */
async function addLikeToAccount(currUserEmail, getTitle, getEmail) {
  //Collect the user's uid
  admin.auth().getUserByEmail(currUserEmail).then(async (userRecord) => {
    const user = userRecord.toJSON();
    //Store the user's uid
    const getUid = user.uid;

    //Add the post to current user's likes
    const userLikes = await db.collection('user').doc(getUid).collection('likes').doc(getTitle).set({
      Email: getEmail,
      Title: getTitle 
    }).then(() => {
      //Console log success if it works
      console.log("Success");
    }).catch(error => {
      //Console log the error
      console.log(error);
    })
  })
}

/**
 * Helper method for /loadposts
 * Returns all the uid in the database
 */
async function getUid() {
  let userUid = [];
  
  const users = db.collection('user');
  const snapshot = await users.get();
  snapshot.forEach(doc => {
    userUid.push(doc.id);
  });

  return userUid;
}

/**
 * Returns all the posts for each uid
 * @param {Ret} uid 
 */
async function getBlogPosts(uid) {
  let getAllPosts = [];
  //Get all the posts
  const items = await db.collection('user').doc(uid).collection('posts').get();
  //Get all the names
  const name = await db.collection('user').doc(uid).get();
          
  items.forEach(title => {
    //Store the name in each obj being pushed into the array
    const obj = title.data();
    obj.Name = name.data().Name;
    obj.Email = name.data().Email;
    getAllPosts.push(obj);
  })
  return getAllPosts; 
}

module.exports = router;