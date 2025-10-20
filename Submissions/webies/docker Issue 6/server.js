import express from "express";
import dotenv from "dotenv";
import Bear from "./models/bear.js";

dotenv.config();
const app = express();
app.use(express.json());

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI); 

app.get("/", (req, res) => res.send("Bear API is running!"));

app.post("/bears", async (req, res) => {
  try {
    const bear = await Bear.create({ name: req.body.name });
    res.status(201).json(bear);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/bears", async (req, res) => {
  const bears = await Bear.find();
  res.json(bears);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));