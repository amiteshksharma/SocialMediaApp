const express = require('express');
const functions = require('firebase-functions');
const stream = require('stream');
const path = require('path');
const tools = require('firebase-tools');
const firebase = require('firebase');
const admin = require('firebase-admin');
const cors = require("cors");
const formidable = require('express-formidable');

const db = admin.firestore();
const router = express.Router();
router.use(cors());

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({});
const getBucket = storage.bucket('staging.socialmedia-c9bf6.appspot.com');


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

router.use(formidable());
const fs = require(`fs`);

router.post('/updateprofile', (req, res, next) => {
    // console.log(req.fields);
    // console.log("====================");
    // console.log(req.files);
    const getIcon = req.files.icon;
    const getImage = req.files.image;
    const getName = req.fields.name;
    const getState = req.fields.state;
    const getEmail = req.fields.email;

    const blobIcon = getBucket.file(getIcon);
    const blobStreamIcon = blobIcon.createWriteStream();

    console.log('============= here ============== ');

    blobStreamIcon.on('error', (err) => {
        console.log("MESSAGE ERROR ===================== ", err.messsage);
        next(err);
    });

    blobStreamIcon.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(
            `https://storage.googleapis.com/${getBucket}/${blobIcon.name}`
        );
        console.log(publicUrl);
        return res.send(publicUrl);
    })

    console.log("====== HERE =====");
    // (async () => {
    //     admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
    //         const user = userRecord.toJSON();
    //         const uid = user.uid;

    //         const getDetails = await db.collection('user').doc(uid).update({
    //             Name: getName,
    //             State: getState,
    //         });

    //         return res.send(true);
    //     }).catch(error => {
    //         console.log(error.message);
    //     })
    // })();
})

module.exports = router;