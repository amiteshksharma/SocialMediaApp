const express = require('express');
const functions = require('firebase-functions');
const path = require('path');
const tools = require('firebase-tools');
const firebase = require('firebase');
const admin = require('firebase-admin');
const cors = require("cors");
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

/**
 * Method to update the user's bio
 */
router.post("/bio", (req, res, next) => {
    //Get the user's email and the new bio message
    const getBio = req.body.bio;
    const getEmail = req.body.email;

    (async () => {
        admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
            //Get the user's uid
            const user = userRecord.toJSON();
            const uid = user.uid;

            //Update his bio
            const setBio = await db.collection('user').doc(uid).update({
                Bio: getBio
            });

            //Return true when done
            return res.send(true);
        }).catch(error => {
            console.log(error);
            return res.send(false);
        })
    })();
})

/**
 * Get all the user's profile information to display on the 'profile' page
 */
router.post('/information', (req, res, next) => {
    //Get his email
    const getEmail = req.body.email;

    (async () => {
        admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
            //Get his uid
            const user = userRecord.toJSON();
            const uid = user.uid;

            //Get all the user's data and send it as an object
            const getDetails = await db.collection('user').doc(uid).get();
            const getData = getDetails.data();

            //Return the data back to the frontend
            return res.send(getData);
        }).catch(error => {
            console.log(error);
            return res.send(false);
        })
    })();
})

/**
 * Updates the user's profile when he clicks 'save changes' on the profile
 * page
 */
router.post('/updateprofile', multer.array("image", 2), (req, res, next) => {
    //Create the icon and image variables
    let getIcon, getImage;

    //Check the label tag to see if one or the other
    //Images were updated
    if(req.body.label === 'image') {
        //Assign one to the body and the other to
        //The file
        getImage = req.body.image
        getIcon = req.files;
    } else if(req.body.label == 'icon') {
        getIcon = req.body.image
        getImage = req.files;
    } else {
        getImage = req.files[0];
        getIcon = req.files[1];   
    }

    //Get the parameters from req.body
    const getName = req.body.name;
    const getState = req.body.state;
    const getEmail = req.body.email;

    try {
        //Loop through the req.files to go through the image files
        req.files.forEach((file, index) => {
            //Create the file underthe folder of the user's email
            const blob = getBucket.file(`${getEmail}/${file.originalname}`);
            
            //Writestream the image to store it.
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });
    
            //Check for any errors in the process
            blobStream.on('error', (err) => {
                console.log("MESSAGE ERROR ===================== ", err);
                next(err);
                return;
            });
    
            //On finish, create the url that will be used for loading
            //The images
            blobStream.on('finish', () => {
                // The public URL can be used to directly access the file via HTTP.
                const publicUrl = format(
                    `https://storage.googleapis.com/${getBucket.name}/${file.originalname}`
                );
                console.log(publicUrl);
            })
            
            //End the file stream
            blobStream.end(file.buffer);     
        })
    } catch(err) {
        console.log(err);
    }

    (async () => {
        admin.auth().getUserByEmail(getEmail).then(async (userRecord) => {
            //Get the user's uid
            const user = userRecord.toJSON();
            const uid = user.uid;

            //Check to see if the url was already sent or get the new one
            let setIconURL = getIcon[0].originalname ? `https://storage.googleapis.com/${getBucket.name}/${getEmail}/${getIcon[0].originalname}` : getIcon;
            let setImageURL = getImage[0].originalname ? `https://storage.googleapis.com/${getBucket.name}/${getEmail}/${getImage[0].originalname}` : getImage;

            //Update the user's personal information
            const getDetails = await db.collection('user').doc(uid).update({
                Name: getName,
                State: getState,
                Icon: setIconURL,
                Image: setImageURL
            });

            //Return true when done
            return res.send(true);
        }).catch(error => {
            console.log(error.message);
        })
    })();
})

module.exports = router;