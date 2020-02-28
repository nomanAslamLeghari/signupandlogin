const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
});





const User = mongoose.model('User',UserSchema);


module.exports = User;
