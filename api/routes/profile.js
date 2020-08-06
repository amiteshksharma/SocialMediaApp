const express = require('express');
const functions = require('firebase-functions');
const stream = require('stream');
const path = require('path');
const tools = require('firebase-tools');
const firebase = require('firebase');
const admin = require('firebase-admin');
const cors = require("cors");
// const formidable = require('express-formidable');
const Multer = require('multer');
const { format } = require('util');

const db = admin.firestore();

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({});
const getBucket = storage.bucket('socialmedia-c9bf6.appspot.com');

const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 20 * 1024 * 1024 // no larger than 5mb
    }
});

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

// router.use(formidable());

router.post('/updateprofile', multer.array("image", 2), (req, res, next) => {
    let getIcon, getImage;

    try {
    if(req.body.label === 'image') {
        getImage = req.body.image
        getIcon = req.files;
    } else if(req.body.label == 'icon') {
        getIcon = req.body.image
        getImage = req.files;
    } else {
        getImage = req.files[0];
        getIcon = req.files[1];   
    }
    } catch (err) {
        console.log(err);
    }


    const getName = req.body.name;
    const getState = req.body.state;
    const getEmail = req.body.email;

    try {
        req.files.forEach((file, index) => {
            const blob = getBucket.file(`${getEmail}/${file.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });
    
            blobStream.on('error', (err) => {
                console.log("MESSAGE ERROR ===================== ", err);
                next(err);
                return;
            });
    
            blobStream.on('finish', () => {
                // The public URL can be used to directly access the file via HTTP.
                const publicUrl = format(
                    `https://storage.googleapis.com/${getBucket.name}/${file.originalname}`
                );
                console.log(publicUrl);
            })
            
            blobStream.end(file.buffer);     
        })
    } catch(err) {
        console.log(err);
    }

    (async () => {
        admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
            const user = userRecord.toJSON();
            const uid = user.uid;

            let setIconURL = getIcon[0].originalname ? `https://storage.googleapis.com/${getBucket.name}/${getEmail}/${getIcon[0].originalname}` : getIcon;
            let setImageURL = getImage[0].originalname ? `https://storage.googleapis.com/${getBucket.name}/${getEmail}/${getImage[0].originalname}` : getImage;

            const getDetails = await db.collection('user').doc(uid).update({
                Name: getName,
                State: getState,
                Icon: setIconURL,
                Image: setImageURL
            });

            return res.send(true);
        }).catch(error => {
            console.log(error.message);
        })
    })();
})

module.exports = router;