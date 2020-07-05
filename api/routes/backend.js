const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require("cors");

const db = admin.firestore();
const router = express.Router();
router.use(cors());
router.post('/create', function(req, res, next) {
  console.log("Hello");
  const title = req.body.title;
  const body = req.body.body;  

  db.collection("user").doc("amitesh").collection("posts").doc("test").set({
    Title: title,
    Body: body,
  }).then(function() {
    console.log("Document successfully written!");
    return res.status(200).send("Success");
  }).catch(function(error) {
    console.error("Error writing document: ", error);
    return res.status(404).send("Error");
  });
  
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