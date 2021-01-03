const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { response } = require("express");

//* DATABASE DRIVER
const dbPromise = async () => {
    return open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });
};
/**************** USER ****************/
// * ADD USER TO DB
const addUser = async (data) => {
    try {
        const dbCon = await dbPromise();
        const user = await dbCon.run(
            `INSERT INTO users (username, email, name, password) 
            VALUES (?,?,?,?)`,
            [data.username, data.email, data.name, data.password]
        );
        console.log("ADDED User: " + data.username + ", to DB");
        return user;
    } catch (err) {
        throw new Error("Error adding User to database: " + err);
    }
};

const getUserByUsername = async (data) => {
    try {
        const dbCon = await dbPromise();
        const user = await dbCon.get(
            "SELECT username, password, id FROM users WHERE username = ?",
            [data]
        );
        return user;
    } catch (err) {
        throw new Error("Error getting User with Username: " + err);
    }
};

const getUserId = async (data) => {
    try {
        const dbCon = await dbPromise();
        const user = await dbCon.get(
            "SELECT id FROM users WHERE username = ?",
            [data]
        );
        return user;
    } catch (err) {
        throw new Error("Error getting User with ID: " + err);
    }
};

const getUserData = async (data) => {
    try {
        const dbCon = await dbPromise();
        const user = await dbCon.get(
            "SELECT username, email, name, userType, id FROM users WHERE username = ?",
            [data]
        );
        return user;
    } catch (err) {
        throw new Error("Error getting User with ID: " + err);
    }
};

/********************* POST ************************/










// Delete post by ID
const deletePostByID = async (data) =>{
    try {
        console.log(data);
        const dbcon = await dbPromise();


        const wipeLikesOnReply = await dbcon.all(
            `DELETE FROM likePost WHERE replyID in (SELECT replyID FROM reply WHERE postID = ?)`, [data]
        )
        const wipeLikesOnPost = await dbcon.all(
            `DELETE FROM likePost WHERE postID = ?`, [data]
        )
        const deleteReplyOnPost = await dbcon.all(
            `DELETE FROM reply WHERE postID = ?`, [data]
        );
        const deletePost = await dbcon.get(
            `DELETE FROM post WHERE postID = ?`, [data]
        );
        console.log('DELETED Replys, Likes and (on) POST: ' + data)
    } catch (err) {
        throw new Error ('Error: ' + err);
    }
};


const updatePostByID = async(data)=>{
    try{
        console.log('Data in db: '+ JSON.stringify(data));
        const dbcon = await dbPromise();
        const updatePost = await dbcon.get(
            "UPDATE post SET title=?, body=? WHERE postID = ?", [data.postTitle, data.postBody, data.postID]
        );
        return updatePost;
    }catch(err){
        throw new Error('Error: ' + err);
    }
}

// * Add product to database
const createPost = async (data) => {
    try {
        const dbCon = await dbPromise();
        const post = await dbCon.run(
            `INSERT INTO post (username, title, body) VALUES (?,?,?)`,
            [data.username, data.title, data.body]
        );
        console.log(data.username + ' CREATED new post!');
        return post;
    } catch (err) {
        throw new Error("Error adding Post to database: " + err);
    }
};

// * Get all products from database
const getPosts = async () => {
    try {
        const dbCon = await dbPromise();
        const posts = await dbCon.all(
            "SELECT * FROM post ORDER BY postID DESC"
        );
        return posts;
    } catch (err) {
        throw new Error("Error getting Comments from database: " + err);
    }
};

// * Get post by id from database
const getPostByID = async (postID) => {
    try {
        const dbCon = await dbPromise();
        const post = await dbCon.get(
            "SELECT * FROM post WHERE postID = ?",
            [postID]
        );
        return post;
    } catch (err) {
        throw new Error("Error getting Post by ID: " + err);
    }
};

const likePost = async (data) => {
    try {
        const dbCon = await dbPromise();
        const like = await dbCon.run(
            `INSERT INTO likePost (username, postID) VALUES (?,?)`,
            [data.username, data.postID]
        );
        await getLikes(data.postID);
        return like;
    } catch (err) {
        throw new Error("Error adding like to Post: " + err);
    }
};

const removePostLike = async (data) => {
    try {
        const dbCon = await dbPromise();
        const removeLike = await dbCon.get(
            `DELETE FROM likePost WHERE postID = ? AND username = ?`,
            [data.postID, data.username]
        );
        await getLikes(data.postID);
        return removeLike;
    } catch (err) {
        throw new Error('Error post like: ' + err);
    }
};

const getLikes = async (postID) => {
    try {
        const dbCon = await dbPromise();
        const getLikes = await dbCon.all(
            `SELECT * FROM likePost WHERE postID = ?`,
            [postID]
        );
        const likeAmount = getLikes.length;
        console.log('Current likes: ' + likeAmount + ', POST ID: ' + postID);
        const updateLikes = await dbCon.get(
            `UPDATE post SET likes = ? WHERE postID = ?`,
            [likeAmount, postID]
        );
        return updateLikes;
    } catch (err) {
        throw new Error("Error showing likes on Post: " + err);
    }
};



/********************* REPLY **************************/

// Delete reply by postID
const deleteReply = async (data) =>{
    try{
        const dbcon = await dbPromise();
        const deleteLikesOnReply = await dbcon.get(
            "DELETE FROM likePost WHERE postID = ?", [data]
        )
        const deleteReply = await dbcon.get(
            `DELETE FROM reply WHERE postID = ?`, [data]
        )
    } catch (err){
        throw new Error ('Error from database.js:' + err);
    }
}

const createReply = async (data) => {
    try {
        const dbCon = await dbPromise();
        const reply = await dbCon.run(
            `INSERT INTO reply (postID, username, reply) VALUES (?,?,?)`,
            [data.postID, data.username, data.reply]
        );
        console.log(data.username + ' REPLIED on POST: ' + data.postID);
        return reply;
    } catch (err) {
        throw new Error("Error adding Reply to database: " + err);
    }
}

const getRepliesByPostID = async (data) => {
    try {
        const dbCon = await dbPromise();
        const replies = await dbCon.all(
            `SELECT * FROM reply WHERE postID like ?`, [data]
        );
        return replies;
    } catch (err) {
        throw new Error("Error getting shitaced XD from database: " + err);
    }
}

const getRepliesByID = async (replyID) => {
  try {
    const dbCon = await dbPromise();
    const reply = await dbCon.get("SELECT * FROM post WHERE replyID = ?", [
      postID,
    ]);
    return reply;
  } catch (err) {
    throw new Error("Error getting Post by ID: " + err);
  }
};

const getReplies = async () => {
    try {
        const dbcon = await dbPromise();
        const replies = await dbcon.all(
            "SELECT * FROM reply ORDER BY replyID DESC"
        );
        return replies;
    } catch (err) {
        console.log('Error getting replies: ' + err);
    }
}

const likeReply = async (data) => {
    try {
        const dbCon = await dbPromise();
        const like = await dbCon.run(
            `INSERT INTO likePost (username, replyID) VALUES (?,?)`,
            [data.username, data.replyID]
        );
        await getReplyLikes(data.replyID);
        return like;
    } catch (err) {
        throw new Error("Error adding like to Post: " + err);
    }
};

const removeReplyLike = async (data) => {
    try {
        const dbCon = await dbPromise();
        const removeLike = await dbCon.get(
            `DELETE FROM likePost WHERE replyID = ? AND username = ?`,
            [data.replyID, data.username]
        );
        await getReplyLikes(data.replyID);
        return removeLike;
    } catch (err) {
        throw new Error("Error post like: " + err);
    }
};

const getReplyLikes = async (replyID) => {
    try {
        const dbCon = await dbPromise();
        const getLikes = await dbCon.all(
            `SELECT * FROM likePost WHERE replyID = ?`,
            [replyID]
        );
        const likeAmount = getLikes.length;
        console.log("Current likes: " + likeAmount + ", REPLY ID:" + replyID);
        const updateLikes = await dbCon.get(
            `UPDATE reply SET likes = ? WHERE replyID = ?`,
            [likeAmount, replyID]
        );
        return updateLikes;
    } catch (err) {
        throw new Error("Error showing likes on Reply: " + err);
    }
};

// const wipeLikesOnPost = async ()


// * EXPORT
module.exports = {
    // * All user exports
    addUser: addUser,
    getUserByUsername: getUserByUsername,
    getUserId: getUserId,
    getUserData: getUserData,
    // * All Post exports
    createPost: createPost,
    getPosts: getPosts,
    getPostByID: getPostByID,
    likePost: likePost,
    getLikes: getLikes,
    removePostLike: removePostLike,
    deletePostByID: deletePostByID,
    updatePostByID: updatePostByID,
    // * All Reply exports
    createReply: createReply,
    getRepliesByPostID: getRepliesByPostID,
    getRepliesByID: getRepliesByID,
    getReplies: getReplies,
    likeReply: likeReply,
    removeReplyLike: removeReplyLike,
    getReplyLikes: getReplyLikes,
    deleteReply: deleteReply,
};
