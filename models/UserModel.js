const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    username:{type:String,required:true ,minlength:[5,"need at least 5 characters"]},
    password:{type:String,required:true}
})

module.exports=  mongoose.model("user",UserSchema)