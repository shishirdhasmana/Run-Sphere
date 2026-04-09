import mongoose from 'mongoose';

const territorySchema = new mongoose.Schema(
  {
    h3Index: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    health: {
      type: Number,
      default: 100, // Decays over time if not defended
    },
    lastCapturedAt: {
      type: Date,
      default: Date.now,
    },
    geometry: {
      type: {
        type: String, // 'Polygon'
        enum: ['Polygon'],
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of numbers
      }
    }
  },
  { timestamps: true }
);

// Create a 2dsphere index on the geometry field
territorySchema.index({ geometry: '2dsphere' });

const Territory = mongoose.model('Territory', territorySchema);

export default Territory;
