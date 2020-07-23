const express = require('express');
const functions = require('firebase-functions');
const tools = require('firebase-tools');
const firebase = require('firebase');
const admin = require('firebase-admin');
const cors = require("cors");

const db = admin.firestore();
const router = express.Router();
router.use(cors());

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

module.exports = router;