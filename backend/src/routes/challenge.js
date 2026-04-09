import express from 'express';
import Challenge from '../models/Challenge.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({ expiresAt: { $gt: new Date() } });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
