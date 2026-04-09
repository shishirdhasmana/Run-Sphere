import mongoose from 'mongoose';

const runSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      default: 'My Run',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    totalDistance: {
      type: Number, // in kilometers
      default: 0,
    },
    averagePace: {
      type: Number, // in minutes per km
      default: 0,
    },
    route: {
      type: {
        type: String,
        enum: ['LineString'],
      },
      coordinates: {
        type: [[Number]], // Array of [lng, lat]
      },
    },
    territoriesCaptured: [{
      type: String, // h3Indexes
    }],
  },
  { timestamps: true }
);

runSchema.index({ route: '2dsphere' });

const Run = mongoose.model('Run', runSchema);

export default Run;
