require('dotenv').config(); 
const express = require('express');
const userRoutes = require('./routes/UserRoutes');
const incidentRoutes = require('./routes/IncidentRoutes');
const staffRoutes = require('./routes/StaffRoutes');


const mongoose = require('mongoose');
const cors = require('cors');
const ShiftRoutes = require('./routes/ShiftRoutes');

const app=express();
app.use(express.json());
app.use(cors())

//routes

app.use('/api/users',userRoutes);
app.use('/api/incident',incidentRoutes);
app.use('/api/staff',staffRoutes);
app.use('/api/shift',ShiftRoutes);

//Connect To MongoDB

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB Connected Successfully');
  })
  .catch((err) => {
    console.error('DB Connection Error:', err.message);
  });

  app.listen(process.env.PORT || 3000, () => {
  console.log(`Backend server is running on port ${process.env.PORT || 3000}`);

});