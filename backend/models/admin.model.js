const mongoose = require('mongoose')

const {Schema} = mongoose
const {ObjectId} = Schema.Types

const adminSchema = new Schema({
    adminUser:{
        type: ObjectId,
        ref: "User",
    }
})
const adminModel = mongoose.model("admin",adminSchema); 
module.exports = adminModel;