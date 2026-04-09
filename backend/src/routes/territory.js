import express from 'express';
import Territory from '../models/Territory.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const territories = await Territory.find({}).populate('ownerId', 'username');
    // Convert to GeoJSON FeatureCollection for Mapbox
    const features = territories.map(t => ({
      type: 'Feature',
      geometry: t.geometry,
      properties: {
        h3Index: t.h3Index,
        ownerId: t.ownerId ? t.ownerId._id : 'neutral',
        ownerName: t.ownerId ? t.ownerId.username : 'Neutral',
        health: t.health
      }
    }));
    res.json({ type: 'FeatureCollection', features });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/capture', protect, async (req, res) => {
  try {
    const { h3Index, geometry } = req.body;
    let territory = await Territory.findOne({ h3Index });
    if (!territory) {
      territory = await Territory.create({
        h3Index, ownerId: req.user.id, health: 100, geometry
      });
    } else {
      territory.ownerId = req.user.id;
      territory.health = 100;
      territory.lastCapturedAt = Date.now();
      await territory.save();
    }
    res.json(territory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
