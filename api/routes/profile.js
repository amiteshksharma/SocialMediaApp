const express = require('express');
const functions = require('firebase-functions');
const tools = require('firebase-tools');
const firebase = require('firebase');
const admin = require('firebase-admin');
const cors = require("cors");

const db = admin.firestore();
const router = express.Router();
router.use(cors());

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFileName: './firebaseSocialMediaKey.json'
});

const bucket = storage.bucket('socialmedia-c9bf6.appspot.com');


router.post("/bio", (req, res, next) => {
    const getBio = req.body.bio;
    const getEmail = req.body.email;

    (async () => {
        admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
            const user = userRecord.toJSON();
            const uid = user.uid;

            const setBio = await db.collection('user').doc(uid).update({
                Bio: getBio
            });

            return res.send(true);
        }).catch(error => {
            console.log(error);
            return res.send(false);
        })
    })();
})

router.post('/information', (req, res, next) => {
    const getEmail = req.body.email;

    (async () => {
        admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
            const user = userRecord.toJSON();
            const uid = user.uid;

            const getDetails = await db.collection('user').doc(uid).get();
            const getData = getDetails.data();

            return res.send(getData);
        }).catch(error => {
            console.log(error);
            return res.send(false);
        })
    })();
})

router.post('/updateprofile', (req, res, next) => {
    const getIcon = req.body.icon;
    const getImage = req.body.image;
    const getName = req.body.name;
    const getState = req.body.state;
    const getEmail = req.body.email;

    console.log(getIcon)
    console.log(getImage);

    bucket.upload(getIcon, function(err, file) {
        if (err) {
            console.log(err);
        }
      });

    (async () => {
        admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
            const user = userRecord.toJSON();
            const uid = user.uid;

            const getDetails = await db.collection('user').doc(uid).update({
                Name: getName,
                State: getState,
                Icon: getIcon,
                Image: getImage
            });

            return res.send(true);
        }).catch(error => {
            console.log(error.message);
        })
    })();
})

module.exports = router;