const mongoose = require('mongoose')

const {Schema} = mongoose
const {ObjectId} = Schema.Types

const userSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    userName:{
        type: String,
        require: true,
        unique: true,
    },
    email:{
        type: String,
        require: true,
        unique:true,
    },
    password:{
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
    },
    location: {
        type: String,
    },
    dob:{
        type: Date,
    },
    followers:[
        {
            type: ObjectId,
            ref: "User",
            default: [],
        }
    ],
    following:[
        {
            type: ObjectId,
            ref: "User",
            default: [],
        }
    ],
    role:{
        type: String,
        default:"USER",
    },
},{ timestamps: true })
const userModel = mongoose.model("User",userSchema); 
module.exports = userModel;