import dotenv from "dotenv";
import Bear from "./models/bear.js";

dotenv.config();

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI); 

const seed = async () => {
  try {

    const count = await Bear.countDocuments();
    if (count === 0) {
      await Bear.insertMany([
        { name: "Grizzly" },
        { name: "Polar" },
        { name: "Panda" }
      ]);
      console.log("Seeded initial bears.");
    } else {
      console.log("Bears collection already seeded.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();