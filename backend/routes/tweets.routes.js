const { 
    createTweet, 
    likeTweet, 
    dislikeTweet, 
    replyTweet, 
    getTweet, 
    getAllTweet, 
    deleteTweet, 
    reTweet,
    getUserTweet, 
} = require("../controllers/tweets.controller");

const { 
    isAuthenticatedUser, 
    authorizeAdminRole 
    } = require("../middleware/auth")
    
const express = require('express');
const router =  express.Router();
const  upload  = require('../middleware/multer');

router.route('/API/tweet').post(isAuthenticatedUser,upload.single('file'),createTweet);
router.route('/API/tweet/:tweetId/like').put(isAuthenticatedUser,likeTweet);
router.route('/API/tweet/:tweetId/dislike').put(isAuthenticatedUser,dislikeTweet);
router.route('/API/tweet/:tweetId/reply').put(isAuthenticatedUser,upload.single('file'),replyTweet);
router.route('/API/tweet/:tweetId').get(getTweet);
router.route('/API/tweets').get(getAllTweet);
router.route('/API/tweets/user/:userId').get(getUserTweet);
router.route('/API/tweet/:tweetId/delete').delete(isAuthenticatedUser,deleteTweet);
router.route('/API/tweet/:tweetId/retweet').put(isAuthenticatedUser,reTweet);

module.exports = router;