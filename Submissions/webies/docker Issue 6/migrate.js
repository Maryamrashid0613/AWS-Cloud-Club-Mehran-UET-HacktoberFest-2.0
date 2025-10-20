dotenv.config();
import mongoose from "mongoose";
import dotenv from "dotenv";
import Bear from "./models/bear.js";

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Bear.init();
    console.log("Migrations applied (indexes ensured)");

    await mongoose.disconnect();
    console.log("Migration complete");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();