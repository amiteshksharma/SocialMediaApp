const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();
const router = express.Router();
router.get('/one', function(req, res, next) {
    (async () => {
        try {
          const value = await db.collection('user').doc('ashwin').get();
          console.log(value);
          console.log(value.data().test);
          return res.send(value.data());
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
});

router.get('/two', function(req, res, next) {
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