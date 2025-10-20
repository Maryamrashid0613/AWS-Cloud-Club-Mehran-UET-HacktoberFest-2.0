const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  location :{type:String,required:true},
status: {
  type: String,
  enum: ["Pending", "Collected", "Skipped"],
  default: "Pending"
},

  photoUrl: { type: String },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
