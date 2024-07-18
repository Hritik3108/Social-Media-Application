const userModel = require('../models/user.model');
const tweetModel = require('../models/tweet.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moment = require('moment');

exports.login = (req,res) => {
    // console.log('login',req.body)
    const {email,password} = req.body;
    userModel.findOne({email}).then(data=>{
        if(!data){
            return res.status(404).json({message:"Invalid Email"});
        }

        let isValidPassword = bcrypt.compareSync(password,data.password);
        if(!isValidPassword){
            res.status(403).send({message:"Invalid Password"});
        }

        let token = jwt.sign({id:data._id},"jwtlock",{expiresIn:"2h"});
        data.password=undefined;
        res.status(200).send({user:data,accessToken:token});
    })
}

exports.register = (req,res) =>{
    // console.log('registering user',req.body.name)
    // console.log('reg',req.body)
    
    const {name,userName,email,password,location,dob,followers,following} = req.body;
    const newUser = new userModel({
        name,userName,email,location,dob,followers,following,password:bcrypt.hashSync(password,10)
    })
    
    if(req.file!=undefined){
        // console.log('filename',req.file.filename)
        newUser.profilePicture=req.file.filename;
    };
    // if(req.file==undefined){console.log('file undefined');}
    // console.log('newUser',newUser);

    userModel.findOne({email}).then(data=>{
        if(!data){
            
            newUser.save().then(data=>{
                let token = jwt.sign({id:data._id},'jwtlock',{expiresIn:"2h"});
                data.password=undefined;
                res.status(200).json({user:data,accessToken: token});
            }).catch(function(error){res.status(400).json('Username already exists!')});
        
        }else{
            res.status(400).send({message:'User already exists!'});
        }
    }).catch(function(error){res.status(500).json({message: error.message})});
}

exports.getUser = async(req,res) => {
    // console.log('getUser',req.params.id)

    try {
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.password=undefined;
        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.follow = async(req,res) => {
    // console.log('follow',req.params.id)
    try {
        const userToFollow = await userModel.findById(req.params.id);
        if (!userToFollow) return res.status(404).json({ error: 'User not found' });

        const currentUser = await userModel.findById(req.user._id);

        if (userToFollow.followers.includes(currentUser._id)) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        userToFollow.followers.push(currentUser._id);
        currentUser.following.push(userToFollow._id);

        await userToFollow.save();
        await currentUser.save();

        res.status(200).json({ message: `followed user with username ${userToFollow.userName}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.unFollow = async(req,res) => {
    // console.log('unfollow',req.params.id)

    try {
        const userToUnfollow = await userModel.findById(req.params.id);
        if (!userToUnfollow) return res.status(404).json({ error: 'User not found' });

        const currentUser = await userModel.findById(req.user._id);

        if (!userToUnfollow.followers.includes(currentUser._id)) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        userToUnfollow.followers.pull(currentUser._id);
        currentUser.following.pull(userToUnfollow._id);

        //I am saving users again because the users are not updated in my system
        await userToUnfollow.save();
        await currentUser.save();

        res.status(200).json({ message: `unfollowed user with username ${userToUnfollow.userName}` });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateUser = async (req, res) => {
    // console.log('edit', req.user._id);
    const { name, location, dob } = req.body;
    
    try {
        let updateFields = { name, location };

        if (dob) {
            updateFields.dob =  dob;
        }
        console.log('update',updateFields);
        const user = await userModel.findByIdAndUpdate(req.user._id, updateFields, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.password=undefined;
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getUserTweets = async(req,res) => {
    // console.log('get tweet of user',req.params.id)
    
    try {
        const tweets = await tweetModel.find({ tweetedBy: req.params.id }).populate('tweetedBy', 'userName profilePicture');
        if (!tweets) return res.status(404).json({ error: 'Something went wrong!' });
        
        res.status(200).send(tweets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.uploadProfilePicture = async(req,res) => {
    // console.log('uploadProfilepic of user',req.user._id)

    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    try {
        const savedProfilePicture = await userModel.findByIdAndUpdate(req.user._id,{profilePicture: req.file.filename}, { new: true });
        if (!savedProfilePicture) return res.status(404).json({ error: 'Something went wrong!' });

        savedProfilePicture.password=undefined;
        res.status(201).json(savedProfilePicture);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}