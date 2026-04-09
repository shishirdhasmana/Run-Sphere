'use client';

import { useState, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';

import { getUser } from '@/lib/auth';
import 'maplibre-gl/dist/maplibre-gl.css';





const DEHRADUN_CENTER = {
  latitude: 30.3165,
  longitude: 78.0322,
  zoom: 12.5
};

// Free Dark Matter style from CARTO
const CARTO_DARK_MATTER = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function MapView({ data }) {
  const user = getUser();

  // Selected polygon for popup
  const [hoverInfo, setHoverInfo] = useState(



    null);

  // Dynamic styling based on owner and health
  const fillLayerStyle = useMemo(() => ({
    id: 'territories-fill',
    type: 'fill',
    paint: {
      'fill-color': [
      'match',
      ['to-string', ['get', 'ownerId']],
      user?._id || 'unauthenticated_user', '#FC4C02', // User's territory: Brand Orange
      'neutral', '#6b7280', // Unclaimed territory: Grey
      '#3b82f6' // Enemy territory: Blue
      ],
      'fill-opacity': [
      'case',
      ['==', ['get', 'ownerId'], 'neutral'], 0.15, // Neutral: subtle grey
      ['interpolate', ['linear'], ['get', 'health'],
      0, 0.1, // Health 0 -> 10% opacity (decaying)
      100, 0.6 // Health 100 -> 60% opacity (healthy)
      ]]

    }
  }), [user?._id]);

  const lineLayerStyle = {
    id: 'territories-line',
    type: 'line',
    paint: {
      'line-color': [
      'match',
      ['to-string', ['get', 'ownerId']],
      user?._id || 'unauthenticated_user', '#FF6A28', // Brighter orange border for user
      'neutral', '#4b5563', // Subtle grey border for unclaimed
      '#60a5fa' // Brighter blue border for enemy
      ],
      'line-width': [
      'case',
      ['==', ['get', 'ownerId'], 'neutral'], 0.5, // Thinner border for neutral
      2 // Normal border for owned
      ],
      'line-opacity': [
      'case',
      ['==', ['get', 'ownerId'], 'neutral'], 0.3, // Very subtle for neutral
      0.8 // Normal for owned
      ]
    }
  };

  const onHover = (event) => {
    const { features, point: { x, y } } = event;
    const hoveredFeature = features && features[0];

    // Valid feature, update hover state
    if (hoveredFeature && hoveredFeature.properties?.h3Index) {
      setHoverInfo({ feature: hoveredFeature, x, y });
    } else {
      setHoverInfo(null);
    }
  };

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Map
        initialViewState={DEHRADUN_CENTER}
        mapStyle={CARTO_DARK_MATTER}
        interactiveLayerIds={['territories-fill']}
        onMouseMove={onHover}
        onMouseLeave={() => setHoverInfo(null)}>
        
        {data &&
        <Source id="territories" type="geojson" data={data}>
            {/* @ts-ignore */}
            <Layer {...fillLayerStyle} />
            {/* @ts-ignore */}
            <Layer {...lineLayerStyle} />
          </Source>
        }

        {hoverInfo && hoverInfo.feature.properties &&
        <div
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+16px)]"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}>
          
            <div className="bg-[#141414]/90 backdrop-blur-md border border-[#2a2a2a] shadow-xl rounded-xl p-4 min-w-[200px] animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
              hoverInfo.feature.properties.ownerId === 'neutral' ?
              'bg-gray-500 shadow-[0_0_8px_#6b7280]' :
              hoverInfo.feature.properties.ownerId === user?._id ?
              'bg-brand shadow-[0_0_8px_#FC4C02]' :
              'bg-blue-500 shadow-[0_0_8px_#3b82f6]'}`
              } />
                {hoverInfo.feature.properties.ownerId === 'neutral' ?
              'Unclaimed Territory' :
              hoverInfo.feature.properties.ownerId === user?._id ?
              'Your Territory' :
              'Enemy Territory'}
              </div>
              
              <div className="space-y-1">
                <p className="text-white font-medium">
                  {hoverInfo.feature.properties.ownerId === 'neutral' ?
                'Run here to claim it!' :
                hoverInfo.feature.properties.ownerId === user?._id ?
                'Captured by You' :
                `Captured by ${hoverInfo.feature.properties.ownerName}`}
                </p>
                
                {hoverInfo.feature.properties.ownerId !== 'neutral' &&
              <>
                    <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-[#2a2a2a]">
                      <span className="text-text-secondary">Health</span>
                      <span className={`font-semibold ${
                  hoverInfo.feature.properties.health > 50 ? 'text-emerald-400' : 'text-amber-400'}`
                  }>
                        {hoverInfo.feature.properties.health}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Status</span>
                      <span className="text-white capitalize truncate w-24 text-right">
                        {hoverInfo.feature.properties.decayStatus}
                      </span>
                    </div>
                  </>
              }
              </div>
            </div>
            
            {/* Triangle pointer */}
            <div className="absolute left-1/2 bottom-[-8px] -translate-x-1/2 border-[8px] border-transparent border-t-[#2a2a2a]" />
            <div className="absolute left-1/2 bottom-[-7px] -translate-x-1/2 border-[7px] border-transparent border-t-[#141414]/90" />
          </div>
        }
      </Map>
    </div>);

}