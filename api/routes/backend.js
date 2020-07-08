const express = require('express');
const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
const cors = require("cors");

const db = admin.firestore();
const router = express.Router();
router.use(cors());
router.post('/create', function(req, res, next) {
  console.log("Hello");
  const title = req.body.title;
  const body = req.body.body;

  const user = firebase.auth().currentUser;

  if(user !== null) {
    db.collection("user").doc(user.uid).collection("posts").doc(title).set({
      Title: title,
      Body: body,
    }).then(function() {
      console.log("Document successfully written!");
      return res.status(200).send("Success");
    }).catch(function(error) {
      console.error("Error writing document: ", error);
      return res.status(404).send("Error");
    });
  } else {
    return res.status(500).send("Error! User not signed in!");
  }
  
});

router.get('/posts/:email', function(req, res, next) {
  const name = req.params.email;
  console.log(name);
  (async () => {
      try {
        admin.auth().getUserByEmail(name)
        .then(async function(userRecord) {
          console.log('Successfully fetched user data:', userRecord.toJSON());
          const user = userRecord.toJSON();
          const value = await db.collection('user').doc(user.uid).collection('posts').get();
          console.log(value);
          
          if(value.docs !== undefined) {
            const array = value.docs.map(doc => doc.data());
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
  console.log(name);
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

router.get('/', function(req, res, next) {
    (async () => {
        try {
          const value = await db.collection('user').doc('amitesh').get();
          console.log(value);
          console.log(value.data().test);
          return res.send("Hello");
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
});

module.exports = router;