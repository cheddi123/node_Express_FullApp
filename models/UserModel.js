const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true,uniqueCaseInsensitive: true },
    username:{type:String,required:true ,minlength:[5,"need at least 5 characters"],unique:true,uniqueCaseInsensitive: true },
    password:{type:String,required:true},
    date: { type: Date, default: Date.now },
})
UserSchema.plugin(uniqueValidator,{message:"Error. expected {PATH} to be unique"});
// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
// UserSchema.post('save', function(error, doc, next) {
//     if (error.name=== 'MongoError' && error.code === 11000) {
//       next(new Error(error));
//     } else {
//       next();
//     }
//   });
module.exports=  mongoose.model("user",UserSchema)