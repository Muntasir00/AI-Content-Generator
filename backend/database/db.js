import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/note-app`);
    console.log('Mongo DB connected Successfully');
  } catch (error) {
    console.log('Mondb Connection Error', error);
  }
};

export default connectDB;
