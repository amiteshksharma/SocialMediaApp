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

router.post('/register', function(req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  
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

router.post('/login', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      const user = firebase.auth().currentUser;
      
      const obj = {
        Email: email,
        Uid: user.uid,
        Name: user.displayName
      };

      return res.status(200).send(obj);
    }).catch(function(error) {
      // Return an error comment and 404 error, indicating account is not found
      return res.status(404).send("Error!");
    });
});

router.get('/', function(req, res, next) {
    (async () => {
        try {
          const value = await db.collection('user').doc('amitesh').collection('posts').get();
          const array = value.docs.map(doc => doc.data());
          console.log(array);
          return res.send(array);
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
});

router.get('/logout', (req, res, next) => {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    // Send token to your backend via HTTPS
    console.log(idToken);
    // ...
  }).catch(function(error) {
    // Handle error
  });
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Logged out");
    return res.send("True");
  }).catch(function(error) {
    // An error happened.
    console.log(error);
  });
})

module.exports = router;