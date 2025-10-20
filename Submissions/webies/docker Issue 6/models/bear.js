import mongoose from "mongoose";

const bearSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model("Bear", bearSchema);