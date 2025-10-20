import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js"
import InvoiceRoutes from "./routes/InvoiceRoutes.js"


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json()); 


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

app.use('/api/product',productRoutes)
app.use('/api/invoice',InvoiceRoutes)


app.get("/", (req, res) => {
  res.send("Backend is running and connected to MongoDB!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
