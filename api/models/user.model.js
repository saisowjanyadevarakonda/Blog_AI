import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,enum:['user','admin'],default:'user'},
    blogs:[{type:mongoose.Schema.Types.ObjectId, ref:'blog'}],
    isSubscribed:{type:Boolean, default:false},
    subscriptionExpiry:{type:Boolean , default:null},
    
},{timestamps:true})


const userModel = mongoose.model("user",userSchema);
export default userModel