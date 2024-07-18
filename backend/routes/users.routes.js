const { 
    register, 
    login, 
    getUser,
    follow,
    unFollow,
    updateUser,
    getUserTweets,
    uploadProfilePicture 
    } = require('../controllers/users.controller');

const { 
    isAuthenticatedUser, 
    authorizeAdminRole 
    } = require("../middleware/auth")
    
const express = require('express');
const router =  express.Router();
const  upload  = require('../middleware/multer');

router.route('/API/auth/register').post(upload.single('file'),register);
router.route('/API/auth/login').post(login);

router.route('/API/user/:id').get(getUser);
router.route('/API/user/:id/follow').put(isAuthenticatedUser,follow);
router.route('/API/user/:id/unfollow').put(isAuthenticatedUser,unFollow);
router.route('/API/user/edit').put(isAuthenticatedUser,updateUser);
router.route('/API/user/:id/tweets').get(isAuthenticatedUser,getUserTweets);
router.route('/API/user/uploadProfilePic').post(isAuthenticatedUser,upload.single('file'),uploadProfilePicture);


module.exports = router;