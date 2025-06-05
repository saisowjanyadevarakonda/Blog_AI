import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
blog :{type:mongoose.Schema.Types.ObjectId,ref:"blog", required:true},
name: {type:String,required:true }  ,
content:{type:String,required:true  },
isApproved:{type:Boolean,default:false},
user:{type:mongoose.Schema.Types.ObjectId,ref:'uesr'},

},{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema);
export default Comment