// src/index.ts
import express from 'express';
import type { Request, Response } from 'express'; 
import dotenv from 'dotenv'; 
import cors from 'cors'; // Import CORS
import experienceRoutes from './routes/experienceRoutes.ts'; // Import the new router (Note the .js extension for ESM)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS Middleware: Allow the frontend to access the API
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your actual frontend URL (e.g., Vite's default port)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// 2. Body Parser Middleware
app.use(express.json());

// 3. API Routes
app.use('/api', experienceRoutes); // All experience routes start with /api

// Basic route check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'BookIt Backend API is running!' });
});

app.listen(PORT, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
});