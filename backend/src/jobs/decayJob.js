import cron from 'node-cron';
import Territory from '../models/Territory.js';

const DECAY_PER_DAY = 10;

/**
 * Apply decay to all owned territories based on how many days
 * have passed since they were last captured/defended.
 */
const runDecay = async () => {
  console.log('Running territory decay job...');
  try {
    const territories = await Territory.find({ ownerId: { $ne: null } });
    let decayed = 0;
    let neutralized = 0;

    for (let t of territories) {
      const lastCaptured = t.lastCapturedAt ? new Date(t.lastCapturedAt) : new Date(t.createdAt);
      const now = new Date();
      const daysSinceCapture = Math.floor((now - lastCaptured) / (1000 * 60 * 60 * 24));

      if (daysSinceCapture <= 0) continue; // Captured today, no decay

      const totalDecay = daysSinceCapture * DECAY_PER_DAY;
      const newHealth = t.health - totalDecay;

      if (newHealth <= 0) {
        await Territory.updateOne({ _id: t._id }, { $set: { ownerId: null, health: 100 } });
        neutralized++;
      } else if (newHealth < t.health) {
        await Territory.updateOne({ _id: t._id }, { $set: { health: newHealth } });
        decayed++;
      }
    }

    console.log(`Territory decay completed: ${decayed} decayed, ${neutralized} neutralized.`);
  } catch (error) {
    console.error('Decay job failed:', error);
  }
};

export const startDecayJob = () => {
  // Run immediately on startup to catch any missed decay
  runDecay();

  // Also run every night at midnight
  cron.schedule('0 0 * * *', runDecay);
};
