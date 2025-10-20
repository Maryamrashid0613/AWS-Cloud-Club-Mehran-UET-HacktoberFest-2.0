const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const connectToDatabase = require("./config/dbConnection")
connectToDatabase();


app.use(express.json());
app.use(cors());



// Sample route
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});



// Middleware
// app.use(express.json()); // Allows us to get data in req.body

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes); // User profiles, student/instructor dashboards
app.use('/api/admin', adminRoutes); // Admin specific functionalities

// // Basic route
// app.get('/', (req, res) => {
//   res.send('SkillBridge Backend API is running!');
// });

// Example course route
app.get("/api/courses", (req, res) => {
  res.json([
    { id: 1, title: "React for Beginners", category: "Programming", duration: "4h" },
    { id: 2, title: "UI/UX Basics", category: "Design", duration: "3h" },
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
