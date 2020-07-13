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
        console.log("Document successfully written!");
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

router.get('/posts', function(req, res, next) {
  const name = req.params;
  (async () => {
      try {
        const user = firebase.auth().currentUser;
        const value = await db.collection('user').doc(user.uid).collection('posts').get();
        const array = value.docs.map(doc => doc.data());
        return res.send(array);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});

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

async function getUidOfUser(email) {
  return admin.auth().getUserByEmail(email).then(async (userRecord) => {
    const user = userRecord.toJSON();
    //Store the user's uid
    return user;
  })
}

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
          console.log("here");
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

router.post('/unlike', (req, res, next) => {
  const getCurrEmail = req.body.currEmail;
  const getEmail = req.body.email;
  const getTitle = req.body.title;

  (async () => {
    admin.auth().getUserByEmail(getCurrEmail).then(async (userRecord) => {
      const userInfo = userRecord.toJSON();
      const getUid = userInfo.uid;

      const unLike = await db.collection('user').doc(getUid).collection('likes').doc(getTitle).delete().then(() => {
        // return res.status(204).send("Unliked!");
        console.log("unliked");
      }).catch(error => {
        console.log(error);
      })

      const postUid = await getUidOfUser(getEmail);
      const unLikeFromPost = await db.collection('user').doc(postUid.uid).collection('posts').doc(getTitle).collection('likes').doc(getUid).delete().then(() => {
        console.log("deleted from post");
      }).catch(error => {
        console.log(error);
      });

      return res.send("Unliked");
    })
  })();
})

router.post('/loadlikes', (req, res, next) => {
  const getEmail = req.body.email;
  const getTitle = req.body.title;
  
  (async () => {
    admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
      const userInfo = userRecord.toJSON();
      const uid = userInfo.uid;

      const likes = await db.collection('user').doc(uid).collection('posts')
      .doc(getTitle).collection('likes').get();
      return res.send({Likes: likes.size});
    })
  })();
})

router.get('/', function(req, res, next) {
    (async () => {
        try {
          const value = await db.collection('user').doc('amitesh').get();
          return res.send("Hello");
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
});

module.exports = router;