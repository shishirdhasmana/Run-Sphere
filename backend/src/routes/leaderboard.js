import express from 'express';
import User from '../models/User.js';
import Territory from '../models/Territory.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Aggregate territory counts per user
    const territoryCounts = await Territory.aggregate([
      { $match: { ownerId: { $ne: null } } },
      { $group: { _id: '$ownerId', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    territoryCounts.forEach(t => { countMap[String(t._id)] = t.count; });

    // Get all users, sorted by totalDistance as fallback
    const users = await User.find({})
      .select('-passwordHash')
      .lean();

    // Attach live territory counts and sort
    const enriched = users.map(u => ({
      ...u,
      territoriesOwned: countMap[String(u._id)] || 0
    }));

    // Sort: territories first, distance as tiebreaker
    enriched.sort((a, b) => {
      if (b.territoriesOwned !== a.territoriesOwned) return b.territoriesOwned - a.territoriesOwned;
      return (b.totalDistance || 0) - (a.totalDistance || 0);
    });

    // Add rank and limit to top 20
    const ranked = enriched.slice(0, 20).map((u, i) => ({ ...u, rank: i + 1 }));

    res.json(ranked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
