import Territory from '../models/Territory.js';
import { getH3Index, getHexagonBoundary } from '../utils/h3Utils.js';

const ATTACK_DAMAGE = 30;

/**
 * Process a run's route and capture/contest territories.
 * Returns an array of captured h3Index strings.
 */
export const processRunCaptures = async (userId, routeCoordinates) => {
  if (!routeCoordinates || routeCoordinates.length === 0) return [];

  // Convert [lng, lat] coords to unique H3 indexes
  const h3Set = new Set();
  for (const coord of routeCoordinates) {
    const [lng, lat] = coord;
    if (lat && lng) {
      const h3Index = getH3Index(lat, lng);
      h3Set.add(h3Index);
    }
  }

  const capturedIndexes = [];

  for (const h3Index of h3Set) {
    try {
      let territory = await Territory.findOne({ h3Index });

      if (!territory) {
        // Unclaimed — instant capture
        const boundary = getHexagonBoundary(h3Index);
        const polygonCoords = boundary.map(([lat, lng]) => [lng, lat]);
        polygonCoords.push(polygonCoords[0]); // Close the ring

        await Territory.create({
          h3Index,
          ownerId: userId,
          health: 100,
          lastCapturedAt: new Date(),
          geometry: { type: 'Polygon', coordinates: [polygonCoords] }
        });
        capturedIndexes.push(h3Index);

      } else if (String(territory.ownerId) === String(userId)) {
        // Own territory — defend (restore health)
        await Territory.updateOne(
          { _id: territory._id },
          { $set: { health: 100, lastCapturedAt: new Date() } }
        );

      } else if (territory.ownerId) {
        // Enemy territory — attack
        const newHealth = territory.health - ATTACK_DAMAGE;
        if (newHealth <= 0) {
          // Ownership flips!
          await Territory.updateOne(
            { _id: territory._id },
            { $set: { ownerId: userId, health: 100, lastCapturedAt: new Date() } }
          );
          capturedIndexes.push(h3Index);
        } else {
          // Damage only
          await Territory.updateOne(
            { _id: territory._id },
            { $set: { health: newHealth } }
          );
        }

      } else {
        // Neutral (ownerId is null) — claim it
        await Territory.updateOne(
          { _id: territory._id },
          { $set: { ownerId: userId, health: 100, lastCapturedAt: new Date() } }
        );
        capturedIndexes.push(h3Index);
      }
    } catch (err) {
      console.error(`Capture error for ${h3Index}:`, err.message);
    }
  }

  return capturedIndexes;
};
