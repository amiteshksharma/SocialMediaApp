const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
require('firebase/auth')
require('dotenv').config();

//Environmental variables inside the bashsouce.ps1 file
firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
  storageBucket: process.env.STORAGE_BUCKET
});

const db = admin.firestore();
const router = express.Router();

/**
 * Method to register the user and add his information to the database
 */
router.post('/register', function(req, res, next) {
  //Get the user's name, email, and password
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const state = req.body.state;
  
  //Create the user with the variables above
  admin.auth().createUser({
    email: email,
    password: password,
    displayName: name
  }).then(() => {
    //Get new user's details and add to db
    admin.auth().getUserByEmail(email).then((userRecord) => {
      const user = userRecord.toJSON();
      // console.log(user);
      db.collection('user').doc(user.uid).set({
        Email: user.email,
        Name: user.displayName,
        Bio: "Your bio is default to this message. Click the pencil to edit it.",
        State: state,
        Icon: 'https://storage.googleapis.com/socialmedia-c9bf6.appspot.com/no-image-user-profile-icon.png',
        Image: 'https://storage.googleapis.com/socialmedia-c9bf6.appspot.com/grey-background.jpg' 
      });
      //Send the obj back to the frontend to use for other methods
      const obj = {
        Email: email,
        State: state,
        Name: user.displayName
      };
  
      return res.send(obj);
    })
  }).catch((error) => {
    console.log(error);
    return res.send({Error: error.message});
  })
});

/**
 * Login method that authenticates the user and allows for redirect
 * To the home page
 */
router.post('/login', function(req, res, next) {
  //get the email and password from input fields 
  const email = req.body.email;
  const password = req.body.password;
  
  //Check if the user exists
  firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
    (async () => {
      admin.auth().getUserByEmail(email).then(async (userRecord) => {
        const user = userRecord.toJSON();
        const uid = user.uid;

        //Go into the database
        const details = await db.collection('user').doc(uid).get();

        //Get the user's information to save
        const obj = {
          Email: details.data().Email,
          State: details.data().State,
          Name: details.data().Name
        }

        //Send the user's details to the frontend for other backend call
        return res.send(obj);
      })
    })();

    }).catch(function(error) {
      // Return an error comment and 404 error, indicating account is not found
      return res.send(false)
      console.log(error);
    });
});

/**
 * Logs out the current user from his session
 */
router.get('/logout', (req, res, next) => {
  //Using firebase function, sign out of session
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    return res.send("True");
  }).catch(function(error) {
    // An error happened.
    console.log(error);
  });
})

/**
 * Follows the user the current user clicks 'follow' on.
 * Adds the follower to the current user's 'following' and
 * to the profile user's 'follower' 
 */
router.post('/follow', (req, res, next) => {
  //Get the email of the current user and the profile user's email
  const userEmail = req.body.userEmail;
  const profileEmail = req.body.profileEmail;
  
  (async () => {
    admin.auth().getUserByEmail(userEmail).then(async (userRecord) => {
      //Get the info for the current user
      const user = userRecord.toJSON();

      //Add the info to the current user's "following"
      const followers = await db.collection('user').doc(user.uid).collection('following').doc(profileEmail).set({
        Email: profileEmail
      })
    }).catch(error => console.log(error))

    admin.auth().getUserByEmail(profileEmail).then(async (userRecord) => {
      //Get the info for the profile user
      const user = userRecord.toJSON();

      //Add the info to the profile user's "followers"
      const followers = await db.collection('user').doc(user.uid).collection('followers').doc(userEmail).set({
        Email: userEmail
      })
    }).catch(error => console.log(error))

    return res.send(true);
  })();
})

/**
 * Unfollows the user the current user clicks 'followed' on.
 * Removes the follower to the current user's 'following' and
 * to the profile user's 'follower' 
 */
router.post('/unfollow', (req, res, next) => {
  //Get the email of the current user and the profile user's email
  const userEmail = req.body.userEmail;
  const profileEmail = req.body.profileEmail;
  
  (async () => {
    admin.auth().getUserByEmail(userEmail).then(async (userRecord) => {
      //Get the info for the profile user
      const user = userRecord.toJSON();

      //Remove the info to the current user's "following"
      const followers = await db.collection('user').doc(user.uid).collection('following').doc(profileEmail).delete().then(() => {
        //Removed the user
      })
    }).catch(error => console.log(error))

    admin.auth().getUserByEmail(profileEmail).then(async (userRecord) => {
      //Get the info for the profile user
      const user = userRecord.toJSON();

      //Removes the info to the profile user's "followers"
      const followers = await db.collection('user').doc(user.uid).collection('followers').doc(userEmail).delete().then(() => {
        //Removed the user
      })
    }).catch(error => console.log(error))

    return res.send(true);
  })();  
})

/**
 * Get the name of the user for the Node in the followers/following list 
 * From the profile page
 */
router.post('/username', (req, res, next) => {
  //Get the email from the fetch 
  const getEmail = req.body.email;

  (async () => {
    admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
      //Get the uid from the user's information
      const user = userRecord.toJSON();
      const uid = user.uid;

      //Get the name from the collection
      const getName = await db.collection('user').doc(uid).get();
      const setName = getName.data().Name;
      const setBio = getName.data().Bio;
      const setEmail = getName.data().Email;
      const setIcon = getName.data().Icon;

      //Return the user's name
      return res.send({Name: setName, Bio: setBio, Email: setEmail, Icon: setIcon});
    })
  })();
})

/**
 * Get all the posts of the user's following list
 */
router.post('/followerspost', (req, res, next) => {
  //Get the mail of the current user
  const currUser = req.body.currUser;

  (async () => {
    admin.auth().getUserByEmail(currUser).then(async (userRecord) => { 
      //Get the current user's uid
      const user = userRecord.toJSON();
      const uid = user.uid;

      //Get the list of followers from FireStore
      const getFollowers = await db.collection('user').doc(uid).collection('following').get().then(snapshot => {
        let arr = [];
        snapshot.forEach(doc => {
          arr.push(doc.id);
        })
        return arr;
      });

      //Convert all emails to uids
      const getUids = await getUidFromEmail(getFollowers);
      let getAllPosts = [];

      //Push all the posts of each uid into array
      for(let uid of getUids) {
        let getPosts = await getBlogPosts(uid);
        //Loop through each post and push to array
        for(let post of getPosts) {
          getAllPosts.push(post);
        }
      }

      //Return Array containing all posts
      return res.send(getAllPosts);
    }).catch(error => {
      console.log(error);
    })
  })();
})

/**
 * Return the usernames of all the users
 * Used for the searchbar
 */
router.get('/getusernames', (req, res, next) => {
  (async () => {
    let usernames = {};
  
    //Get the users
    const users = db.collection('user');
    const snapshot = await users.get();

    //Push each user's name into the array
    snapshot.forEach(doc => {
      let name = doc.data().Name;
      let email = doc.data().Email;
      usernames[name] = email;
    });
  
    //Return the array containing all the user's names
    return res.send(usernames);
  })();
})

router.post('/usersnear', (req, res, next) => {
  const states = req.body.statelist;
  (async () => {
    const list = [];
    for(let state of states) {
      const usersLocation = await db.collection('user').where("State", "==", state).get().then(snap => {
        snap.forEach(doc => {
          list.push({
            Name: doc.data().Name,
            Bio: doc.data().Bio,
            Email: doc.data().Email,
            Icon: doc.data().Icon
          });
        })
      })
    }

    return res.send(list);
  })()
})

/**
 * -----------------------------------------
 * BEGINNING OF HELPER METHODS FOR THIS FILE
 * -----------------------------------------
 */

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
    obj.Icon = name.data().Icon;
    getAllPosts.push(obj);
  })
  
  return getAllPosts; 
}

/**
 * Converts all the emails in the array to the user's uid
 * @param {Array} arr Array containing emails
 */
async function getUidFromEmail(arr) {
  //Intialize the array
  const array = [];
  //Loop through the 'arr' parameter
  for(let user of arr) {
    //Convert each email to the uid using getUserByEmail
    const getuid = admin.auth().getUserByEmail(user).then(async (userRecord) => {
      return userRecord.toJSON().uid;
    })
    
    //Push the uid to the const array
    array.push(await getuid);
  }

  return await array;
}

module.exports = router;