const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
require('firebase/auth')

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
    console.log(req.body);
    console.log(req.body.email);
    console.log(req.body.password);

    const email = req.body.email;
    const password = req.body.password;
    let isSuccess = true;

    console.log(email);
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      res.status(200).send("Success!");
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      res.status(404).send("error!");
    });
});

router.get('/', function(req, res, next) {
    (async () => {
        try {
          const value = await db.collection('user').doc('amitesh').get();
          console.log(value);
          console.log(value.data().test);
          return res.send(value.data());
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
});

module.exports = router;