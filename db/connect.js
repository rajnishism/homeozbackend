import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = () => {
  // Database connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlparser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;

  connection
    .once("open", function () {
      console.log("MongoDB connected");
    })
    .on("error", function (err) {
      console.log(err);
    });
};

export default connectDB;
