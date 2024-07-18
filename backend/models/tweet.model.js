const mongoose = require('mongoose')

const {Schema} = mongoose
const {ObjectId} = Schema.Types

const tweetSchema = new Schema({
    content:{
        type: String,
        require: true
    },
    tweetedBy:{
            type: ObjectId,
            ref: "User",
            require: true,
    },
    likes:[{
        type: ObjectId,
        ref: "User",
        default: [],
    }],
    retweetBy:[{
        type: ObjectId,
        ref: "User",
        default: [],
    }],
    image:{
        type: String,
    },
    replies:[{
        type: ObjectId,
        ref: "tweet",
        default: [],
    }],
},{ timestamps: true });

const tweetModel = mongoose.model("tweet",tweetSchema); 
module.exports = tweetModel;