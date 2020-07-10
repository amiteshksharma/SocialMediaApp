const express = require('express');
const functions = require('firebase-functions');
const tools = require('firebase-tools');
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

  firebase.auth().onAuthStateChanged( (user) => {
    if(user) {
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
    } else{
        return res.status(500).send("Error! User not signed in!");
    }
  });
  
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

async function getUid() {
  let userUid = [];
  
  const users = db.collection('user');
  // console.log(users)
  const snapshot = await users.get();
  // console.log(snapshot);
  snapshot.forEach(doc => {
    userUid.push(doc.id);
  });

  return userUid;
}

async function getBlogPosts(uid) {
  let getAllPosts = [];
  const items = await db.collection('user').doc(uid).collection('posts').get();
  const name = await db.collection('user').doc(uid).get();
  console.log(name.data().Name);
          
  items.forEach(title => {
    const obj = title.data();
    obj.Name = name.data().Name;
    console.log(title.data());
    getAllPosts.push(obj);
  })
  // console.log(getAllPosts);
  return getAllPosts; 
}

router.get('/loadposts', (req, res, next) => {
  let uidList = [];
  async function getAllPosts() {
    uidList = await getUid();
    let getAllPosts = [];

    for(let uid of uidList) {
      let getPosts = await getBlogPosts(uid);
      for(let post of getPosts) {
        getAllPosts.push(post);
      }
    }
    
    console.log(getAllPosts);
    return res.status(200).send(getAllPosts);
  }

  (async () => {
    return await getAllPosts();
  })();
})

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