import express from 'express';
import Run from '../models/Run.js';
import User from '../models/User.js';
import Territory from '../models/Territory.js';
import { protect } from '../middleware/auth.js';
import { updateStreak } from '../services/streakService.js';
import { processRunCaptures } from '../services/captureService.js';

const router = express.Router();

// GET /api/runs — fetch authenticated user's runs
router.get('/', protect, async (req, res) => {
  try {
    const runs = await Run.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(runs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, startTime, endTime, totalDistance, averagePace, route } = req.body;

    // Auto-capture territories from route coordinates
    let capturedIndexes = [];
    if (route && route.geometry && route.geometry.coordinates) {
      capturedIndexes = await processRunCaptures(req.user.id, route.geometry.coordinates);
    }
    
    const run = await Run.create({
      userId: req.user.id,
      name: name || 'Untitled Run',
      startTime: startTime || new Date(),
      endTime: endTime || new Date(),
      totalDistance: totalDistance || 0,
      averagePace: averagePace || 0,
      route,
      territoriesCaptured: capturedIndexes
    });

    // Update user stats
    const ownedCount = await Territory.countDocuments({ ownerId: req.user.id });
    await User.updateOne(
      { _id: req.user.id },
      { $inc: { totalDistance: totalDistance || 0 }, $set: { territoriesOwned: ownedCount } }
    );
    
    // Update streaks
    await updateStreak(req.user.id);

    res.status(201).json(run);
  } catch (error) {
    console.error('Run save error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-runs', protect, async (req, res) => {
  try {
    const runs = await Run.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(runs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const run = await Run.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!run) return res.status(404).json({ message: 'Run not found' });
    // Subtract distance from user
    await User.updateOne({ _id: req.user.id }, { $inc: { totalDistance: -(run.totalDistance || 0) } });
    res.json({ message: 'Run deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
