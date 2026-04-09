import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Challenge from '../models/Challenge.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    await Challenge.deleteMany();
    await Challenge.create([
      { title: 'First 5K', description: 'Run a 5K', targetType: 'DISTANCE', targetValue: 5, expiresAt: new Date(Date.now() + 86400000 * 7) },
      { title: 'Conqueror', description: 'Capture 5 territories', targetType: 'TERRITORIES', targetValue: 5, expiresAt: new Date(Date.now() + 86400000 * 3) }
    ]);
    console.log('Challenges seeded.');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
