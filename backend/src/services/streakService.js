import User from '../models/User.js';

export const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();
  const lastRun = user.lastRunDate ? new Date(user.lastRunDate) : null;
  
  let newStreak;
  if (!lastRun) {
    newStreak = 1;
  } else {
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastStart = new Date(lastRun.getFullYear(), lastRun.getMonth(), lastRun.getDate());
    const diffDays = Math.round((nowStart - lastStart) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      newStreak = (user.currentStreak || 0) + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    } else {
      newStreak = user.currentStreak || 1;
    }
  }
  
  await User.updateOne(
    { _id: userId },
    { $set: { currentStreak: newStreak, lastRunDate: now } }
  );
};
