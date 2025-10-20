require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = require('./config/db.config');
connectDB();

const UserRoutes = require('./routes/user.routes');
const IncidentRoutes = require('./routes/file.routes');
const StaffRoutes = require('./routes/staff.routes');
const AdminSummaryRoute = require('./routes/admin.routes');


app.use('/api/user', UserRoutes);
app.use('/api/report', IncidentRoutes);
app.use('/api/staff', StaffRoutes);
// app.use('/api/shift', ShiftRoutes);
app.use('/api/admin', AdminSummaryRoute);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
