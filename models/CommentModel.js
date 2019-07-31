const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    comment:{type:String,required:true},
    author:{type:String},
    id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    username:{type:String} ,
    createdAt:{type:Date,default:Date.now}
})


module.exports= mongoose.model("comment",CommentSchema)
//

