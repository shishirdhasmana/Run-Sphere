'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import MapView from '@/components/MapView';
import { Loader2 } from 'lucide-react';


export default function MapPage() {
  // Fetch territories as GeoJSON
  const { data: territoriesGeoJSON, isLoading } = useQuery({
    queryKey: ['territories', 'geojson'],
    queryFn: async () => {
      const res = await api.get('/territories');
      return res.data;
    },
    // Refetch every 30 seconds for live updates
    refetchInterval: 30000
  });

  return (
    <div className="h-[calc(100vh-8rem)] animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Territory Map</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time view of Dehradun's captured hexagons.
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 bg-black/50 px-4 py-2 rounded-xl border border-[#2a2a2a] backdrop-blur-sm text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FC4C02] opacity-80" />
            <span className="text-white">Your Territory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#3b82f6] opacity-80" />
            <span className="text-white">Contested / Enemy</span>
          </div>
        </div>
      </div>

      <div className="w-full h-full glass-card overflow-hidden relative">
        {isLoading ?
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
              <p className="text-brand font-medium animate-pulse">Loading territory data...</p>
            </div>
          </div> :
        null}

        <MapView data={territoriesGeoJSON} />
      </div>
    </div>);

}