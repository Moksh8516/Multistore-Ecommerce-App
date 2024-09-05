import dotenv from "dotenv";
dotenv.config({
  path: "./env"
})
import connectDB from './db/index.js'
import { app } from "./app.js";

const port = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.on("ERROR", (Err) => {
      console.log(`ERROR :- Express is failed to Connected with MONGODB`)
      throw Err;
    })
    app.listen(port, () => {
      console.log("Server is listen at PORT NO :- ", port)
    })
  }).catch((err) => {
    console.log("MongoDb connection failed", err)
  })