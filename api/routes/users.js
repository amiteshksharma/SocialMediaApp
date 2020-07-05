const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
require('firebase/auth')

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
router.post('/login', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      //Login was sucessful, send a 200 response
      return res.status(200).send("Success!");
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

module.exports = router;