import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// --- Route Imports ---
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

// --- Initializations ---
dotenv.config();
connectDB();
const app = express();

// --- Middleware ---
// This allows your frontend to communicate with your backend
app.use(cors()); 
// This allows the server to accept JSON data in the request body
app.use(express.json()); 

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`🚀 Server running on port ${PORT}`));