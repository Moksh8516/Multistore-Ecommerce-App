import mongoose from "mongoose";
import { DB_Name } from '../constants.js'
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
    console.log("MongoDB Connection is connected SUCCESSFULLY ON DB HOST !! :  " + conn.connection.host);
  } catch (error) {
    console.log(`MONGODB connection is FAILED `, error);
    process.exit(1);
  }
}

export default connectDB;
