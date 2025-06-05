import express from 'express'
import { getComments, getProfile, loginUser, paymentRazorpay, registerUser, verifyRazorpay } from '../controllers/userController.js';
import { authUser } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/get-profile',authUser,getProfile);
userRouter.get('/get-comments',authUser,getComments);
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verify-razorpay',authUser,verifyRazorpay);



export default userRouter;