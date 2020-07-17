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
  measurementId: process.env.MEASUREMENT_ID
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
        Name: user.displayName
      });
      //Send the obj back to the frontend to use for other methods
      const obj = {
        Email: email,
        Uid: user.uid,
        Name: user.displayName
      };
  
      return res.send(obj);
    })
  }).catch((error) => {
    console.log(error);
    res.status(404).send("Error");
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
    const user = firebase.auth().currentUser;
    
    const obj = {
      Email: email,
      Uid: user.uid,
      Name: user.displayName
    };

    //Send the user's details to the frontend for other backend call
    return res.status(200).send(obj);
    }).catch(function(error) {
      // Return an error comment and 404 error, indicating account is not found
      return res.status(404).send("Error!");
    });
});

/**
 * Logs out the current user from his session
 */
router.get('/logout', (req, res, next) => {
  //Using firebase function, sign out of session
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Logged out");
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
        console.log("Deleted profile Email");
      })
    }).catch(error => console.log(error))

    admin.auth().getUserByEmail(profileEmail).then(async (userRecord) => {
      //Get the info for the profile user
      const user = userRecord.toJSON();

      //Removes the info to the profile user's "followers"
      const followers = await db.collection('user').doc(user.uid).collection('followers').doc(userEmail).delete().then(() => {
        console.log("Deleted user Email")
      })
    }).catch(error => console.log(error))

    return res.send(true);
  })();  
})

module.exports = router;