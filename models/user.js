const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define user schema
const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
    
})



// Adding the passport-local-mongoose plugin to the schema
// This plugin adds functionality for handling authentication, such as hashing and salting passwords
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);