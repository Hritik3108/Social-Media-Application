const tweetModel = require('../models/tweet.model')


exports.createTweet = async(req,res) =>{
    // console.log('create tweet')
    const  content  = req.body.content;    
    
    try {
        const newTweet = new tweetModel({
            content: content,
            tweetedBy: req.user._id,
        });
        
        if(req.file!=undefined){
            newTweet.image=req.file.filename;
        };
        console.log(newTweet);
        const savedTweet = await newTweet.save();
        res.status(201).json(savedTweet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    
}

exports.likeTweet = async(req,res) =>{
    // console.log('like tweet')

    try {
        const tweet = await tweetModel.findById(req.params.tweetId);
        if (!tweet) return res.status(404).json({ error: 'Tweet not found' });

        if (tweet.likes.includes(req.user._id)) {
            return res.status(400).json({ error: 'You already liked this tweet' });
        }

        tweet.likes.push(req.user._id);
        await tweet.save();

        res.status(200).json({message:`tweet with id ${tweet._id} liked`});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    
}

exports.dislikeTweet = async(req,res) =>{
    // console.log('unlike tweet')

    try {
        const tweet = await tweetModel.findById(req.params.tweetId);
        if (!tweet) return res.status(404).json({ error: 'Tweet not found' });

        if (!tweet.likes.includes(req.user._id)) {
            return res.status(400).json({ error: 'You have not liked this tweet' });
        }

        tweet.likes.pull(req.user._id);
        await tweet.save();

        res.status(200).json({message:`tweet with id ${tweet._id} unliked`});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    
}

exports.replyTweet = async(req,res) =>{
    // console.log('comment tweet')
    const content  = req.body.content;
    
    try {
        // console.log('tweetId',req.params.tweetId)
        const genesisTweet = await tweetModel.findById(req.params.tweetId);
        if (!genesisTweet) return res.status(404).json({ error: 'Tweet not found' });

        // console.log('genesis tweet',genesisTweet)

        const newTweet = new tweetModel({
            content,
            tweetedBy: req.user._id,
        });

        // console.log('newTweet',newTweet);

        const savedTweet = await newTweet.save();
        // console.log('savedTweet',savedTweet);
        
        genesisTweet.replies.push(savedTweet._id);
        await genesisTweet.save();

        res.status(201).json(savedTweet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    
}

exports.getTweet = async(req,res) =>{
    // console.log('get tweet')

    try {
        const tweet = await tweetModel.findById(req.params.tweetId)
        .populate('tweetedBy replies', 'userName profilePicture')
        .populate({
            path: 'replies',
            populate: {
                path: 'tweetedBy',
                select: 'userName profilePicture'
            }
        });

        if (!tweet) return res.status(404).json({ error: 'Tweet not found' });
        res.status(200).json(tweet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    
}

exports.getAllTweet = async(req,res) =>{
    // console.log('get all tweet')
    try {
        const tweets = await tweetModel.find()
        .populate('tweetedBy', 'userName profilePicture')
        .populate('retweetBy', 'userName');
        if (!tweets) return res.status(404).json({ error: 'Tweet not found' });
        res.status(200).json(tweets);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.getUserTweet = async(req,res) =>{
    // console.log('get user all tweet')
    const userId=req.params.userId;
    try {
        const tweets = await tweetModel.find({tweetedBy:userId}).populate('tweetedBy', 'userName profilePicture');
        if (!tweets) return res.status(404).json({ error: 'Tweet not found' });
        res.status(200).json(tweets);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


exports.deleteTweet = async(req,res) =>{
    // console.log('delete tweet')
    try {
        const tweet = await tweetModel.findByIdAndDelete(req.params.tweetId);
        if (!tweet) return res.status(404).json({ error: 'Tweet not found' });
        
        res.status(200).json({ message: 'tweet deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.reTweet = async(req,res) =>{
    // console.log('reTweet tweet')
    try{
        const tweet = await tweetModel.findByIdAndUpdate(req.params.tweetId);
        if (!tweet) return res.status(404).json({ error: 'Tweet not found' });

        if (tweet.retweetBy.includes(req.user._id)) {
            return res.status(400).json({ error: 'You have already retweeted this tweet' });
        }

        tweet.retweetBy.push(req.user._id);
        await tweet.save();

        res.status(200).json({message:`tweet with id ${tweet._id} retweeted`});

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}