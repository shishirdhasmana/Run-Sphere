import { latLngToCell, cellToBoundary } from 'h3-js';

// Default resolution for RunSphere territories
const H3_RESOLUTION = 9;

export const getH3Index = (lat, lng, resolution = H3_RESOLUTION) => {
  return latLngToCell(lat, lng, resolution);
};

export const getHexagonBoundary = (h3Index) => {
  return cellToBoundary(h3Index);
};
