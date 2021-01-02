const { request, response } = require("express");
const express = require("express");
const dbservice = require("../../database");
const router = express.Router();

// * Post a topic.
router.post('/post', async (req, res) => {
    try {
        const topic = {
            username: USER_NAME,
            title: req.body.title,
            body: req.body.body
        };
        console.log(topic);
        await dbservice.createPost(topic);
        return topic;
    } catch (err) {
        res.send('Error sending commment');
    }
});

// * Get post by id
router.get("/post/:id", async (req, res) => {
  const paramID = req.params.id;
  try {
    const found = await dbservice.getPostByID(paramID);
    if (found) {
      res.send(found);
      return found;
    } else {
      res
        .status(400)
        .send({ ERROR: `Post with ID: ${paramID} does not exist.` });
    }
  } catch (err) {
    res.send(err);
  }
});

// * Get posts, get them all
router.get("/posts", async (req, res) => {
    try {
        const posts = await dbservice.getPosts();
        res.send(posts);
    } catch (err) {
        res.send(err);
    }
});

// * LIKE POST
router.post("/postlike/:id", async (req, res) => {
  const paramID = req.params.id;
  try {
    const addLike = {
      username: USER_NAME,
      postID: paramID
    };
    console.log("User: " + USER_NAME + ", -- LIKED POST: " + paramID);
    await dbservice.likePost(addLike);
    return addLike;
  } catch (err) {
    res.send(err);
  }
});

router.get("/postdislike/:id", async (req, res) =>{
  const paramID = req.params.id;
  try{
    const dislike = {
      username : USER_NAME,
      postID : paramID
    };
    console.log("User: " + USER_NAME + ", -- DISLIKED POST: " + paramID);
    await dbservice.removePostLike(dislike);
    return dislike;
  }catch(err){
    console.log('Error: ' + err);
  }
});



module.exports = router;