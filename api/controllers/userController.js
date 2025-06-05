import bcrypt from 'bcryptjs'
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import Comment from '../models/Comment.js';
import razorpay from 'razorpay'

export const registerUser = async(req,res) =>{
    try {
        const {name, email , password} = req.body;
        if(!name || !email || !password){
           return  res.json({success:false,message:"all fields are compulsory"});
        }
        if(password.length < 8){
           return res.json({success:false, message:"password is weak"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const userData = {
            name, email, password:hashedPassword
        }
        const newUser = userModel(userData);
        const user = await newUser.save()
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
       return  res.json({success:true,token});
    } catch (error) {
      return  res.json({success:false,message:error.message});
    }
}


export const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
           return res.json({success:false,message:"user does not exist"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
           const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
          return res.json({success:true,token});
        }
        else{
         return res.json({success:false,message:"password does not matched"});
        }
    } catch (error) {
      return res.json({success:false,message:error.message});
    }
}

export const getProfile = async(req,res) => {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password');
        res.json({success:true,userData});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

export const getComments = async(req,res) => {
    try {
        const userId = req.userId;
        const comments = await Comment.find({user:userId}).populate('blog','title');
        res.json({success:true,comments});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

export  const paymentRazorpay = async(req,res) => {
    try {
        const userId = req.userId;
        if(!userId){
            return res.json({success:false,message:"user not found"});
        }
        const options = {
            amount: 4900,
            currency :process.env.CURRENCY,
            receipt: userId,
        }
        try {
            const order = await razorpayInstance.orders.create(options);
            console.log('razorpay order created', order);
            res.json({success:true,order});
        } catch (error) {
            console.log("razorpay error: ",error);
            res.json({success:false,message:error.message});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export const verifyRazorpay = async (req,res) => {
try {
    const {razorpay_order_id} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if(orderInfo.status === 'paid'){
       const subscriptionDurationDays  = 30;
       const expiryDate =  new Date();
       expiryDate.setDate(expiryDate.getDate() + subscriptionDurationDays);
       

        await userModel.findByIdAndUpdate(orderInfo.receipt,{isSubscribed:true,subscriptionExpiry:expiryDate});
        res.json({success:true,message:"payment Successfull"});
    }
} catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
}
}