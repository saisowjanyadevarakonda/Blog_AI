import mongoose from "mongoose";

const connectDB = async() => {
  try {
    mongoose.connection.on('connected',() => console.log('Database connected'));
    await mongoose.connect(`${process.env.MONGODB_URI}/blogidity`);
  } catch (error) {
    console.log(error);
  }
}

export default connectDB