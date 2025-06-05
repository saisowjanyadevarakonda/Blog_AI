import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'uesr',required:true},
    startDate:{type:Date,default:Date.now},
    expiryDate:{type:Date,required:true}   ,
    status:{type:String,enum:['active','expired','cancelled'],default:'active'},
    paymentId:{type:String},

},{timestamps:true })

const Subscription = mongoose.model('subscription',subscriptionSchema);
export default Subscription