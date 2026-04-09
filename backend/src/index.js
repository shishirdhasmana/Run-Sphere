import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import territoryRoutes from './routes/territory.js';
import runRoutes from './routes/run.js';
import challengeRoutes from './routes/challenge.js';
import leaderboardRoutes from './routes/leaderboard.js';
import { startDecayJob } from './jobs/decayJob.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/users', userRoutes);
app.use('/api/territories', territoryRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RunSphere Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startDecayJob();
});
