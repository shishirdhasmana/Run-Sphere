import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetType: { type: String, enum: ['DISTANCE', 'TERRITORIES'], required: true },
    targetValue: { type: Number, required: true },
    rewardPoints: { type: Number, default: 100 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
