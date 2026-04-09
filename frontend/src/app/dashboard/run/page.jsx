'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Play, Square, Pause, MapPin, Timer, Activity, Save, Map as MapIcon } from 'lucide-react';
import MapView from '@/components/MapView';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function RunTrackerPage() {
  const router = useRouter();
  const [status, setStatus] = useState('IDLE'); // IDLE, RUNNING, PAUSED, SAVING_PROMPT, SAVING
  const [distance, setDistance] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [route, setRoute] = useState([]);
  const [runName, setRunName] = useState('Morning Run');
  
  const timerRef = useRef(null);
  const watchIdRef = useRef(null);
  const simIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const pace = distance > 0 ? (elapsedSeconds / 60) / distance : 0;
  const formatPace = (p) => {
    if (p === 0 || !isFinite(p)) return "--:--";
    const mins = Math.floor(p);
    const secs = Math.floor((p - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')} /km`;
  };

  const handleLocationUpdate = (lat, lng) => {
    setRoute(prevRoute => {
      if (prevRoute.length > 0) {
        const lastPoint = prevRoute[prevRoute.length - 1];
        const dist = calculateDistance(lastPoint[1], lastPoint[0], lat, lng);
        setDistance(prevDist => prevDist + dist);
      }
      return [...prevRoute, [lng, lat]];
    });
  };

  const startSimulation = () => {
    console.log("Starting GPS Simulation fallback.");
    let lat = 30.3165;
    let lng = 78.0322;
    handleLocationUpdate(lat, lng);

    simIntervalRef.current = setInterval(() => {
      lat += 0.00003 + (Math.random() * 0.00002);
      lng += 0.00003 + (Math.random() * 0.00002);
      handleLocationUpdate(lat, lng);
    }, 2000);
  };

  const startRun = () => {
    setStatus('RUNNING');
    startTimeRef.current = new Date();
    
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => handleLocationUpdate(position.coords.latitude, position.coords.longitude),
        (err) => {
          console.warn("Geolocation error, defaulting to simulation:", err.message || "Unknown");
          startSimulation();
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      console.warn("Geolocation unsupported, using simulation.");
      startSimulation();
    }
  };

  const pauseRun = () => {
    setStatus('PAUSED');
    clearInterval(timerRef.current);
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (simIntervalRef.current !== null) clearInterval(simIntervalRef.current);
  };

  const resumeRun = () => {
    setStatus('RUNNING');
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    
    if (navigator.geolocation && watchIdRef.current !== null) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => handleLocationUpdate(position.coords.latitude, position.coords.longitude),
        (err) => console.warn("Geolocation resume error:", err.message),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      startSimulation();
    }
  };

  const finishRun = () => {
    setStatus('SAVING_PROMPT');
    clearInterval(timerRef.current);
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (simIntervalRef.current !== null) clearInterval(simIntervalRef.current);
  };

  const saveRun = async () => {
    setStatus('SAVING');
    const safeDist = isFinite(distance) ? parseFloat(distance.toFixed(4)) : 0;
    const safePace = isFinite(pace) ? parseFloat(pace.toFixed(2)) : 0;
    try {
      const res = await api.post('/runs', {
        name: runName || 'Untitled Run',
        startTime: startTimeRef.current || new Date(),
        endTime: new Date(),
        totalDistance: safeDist,
        averagePace: safePace,
        route: {
          geometry: {
            type: 'LineString',
            coordinates: route.length > 1 ? route : [[78.0322, 30.3165], [78.0323, 30.3166]]
          }
        }
      });
      const captured = res.data?.territoriesCaptured?.length || 0;
      if (captured > 0) {
        alert(`🎉 You captured ${captured} territor${captured === 1 ? 'y' : 'ies'}!`);
      }
      router.push('/dashboard');
    } catch (err) {
      console.error('Error saving run', err);
      alert('Failed to save run. Please check console for details.');
      setStatus('SAVING_PROMPT'); 
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (simIntervalRef.current !== null) clearInterval(simIntervalRef.current);
    };
  }, []);

  const routeGeoJSON = route.length > 1 ? {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: route },
      properties: { color: '#FC4C02', title: runName }
    }]
  } : null;

  if (status === 'SAVING_PROMPT' || status === 'SAVING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] animate-fade-in-up p-4">
        <div className="glass-card max-w-lg w-full p-8 border-brand/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Save Your Run</h2>
          
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Name your run</label>
              <input 
                type="text" 
                value={runName}
                onChange={(e) => setRunName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors shadow-inner"
                placeholder="Morning Run"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] shadow-inner">
            <div className="text-center">
              <div className="text-xs text-text-secondary uppercase tracking-widest mb-1">Distance</div>
              <div className="text-xl font-bold text-white">{distance.toFixed(2)}km</div>
            </div>
            <div className="text-center border-l border-r border-[#2a2a2a]">
              <div className="text-xs text-text-secondary uppercase tracking-widest mb-1">Time</div>
              <div className="text-xl font-bold text-white">{formatTime(elapsedSeconds)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-text-secondary uppercase tracking-widest mb-1">Pace</div>
              <div className="text-xl font-bold text-white">{formatPace(pace)}</div>
            </div>
          </div>

          <div className="mb-8 h-48 rounded-xl overflow-hidden border border-[#2a2a2a] relative shadow-inner">
            {routeGeoJSON ? (
              <MapView data={routeGeoJSON} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a1a] text-text-secondary">
                <MapIcon className="w-8 h-8 mb-2 opacity-50" />
                <p>No map data recorded</p>
              </div>
            )}
          </div>

          <button 
            disabled={status === 'SAVING'} 
            onClick={saveRun} 
            className="w-full py-4 bg-brand text-white font-bold text-lg rounded-xl hover:bg-brand-light transition-all shadow-[0_0_20px_rgba(252,76,2,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'SAVING' ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {status === 'SAVING' ? 'Saving...' : 'Save Run'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] animate-fade-in-up p-4">
      <div className="glass-card max-w-md w-full p-8 text-center border-brand/20 relative overflow-hidden shadow-2xl">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-[#1a1a1a]">
          <div className="h-full bg-brand rounded-r-md transition-all duration-1000" style={{ width: status === 'RUNNING' ? '100%' : '0%' }}></div>
        </div>

        <div className="w-24 h-24 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(252,76,2,0.2)]">
          <Activity className={`w-12 h-12 ${status === 'RUNNING' ? 'animate-pulse' : ''}`} />
        </div>

        <h1 className="text-5xl font-extrabold text-white tracking-widest tabular-nums mb-8 font-mono">
          {formatTime(elapsedSeconds)}
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] shadow-inner">
            <div className="flex items-center justify-center text-text-secondary mb-2 text-sm uppercase tracking-wider font-semibold">
              <MapPin className="w-4 h-4 mr-2" />
              Distance
            </div>
            <div className="text-2xl font-bold text-white">{distance.toFixed(2)} <span className="text-sm text-text-secondary">km</span></div>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] shadow-inner">
             <div className="flex items-center justify-center text-text-secondary mb-2 text-sm uppercase tracking-wider font-semibold">
              <Timer className="w-4 h-4 mr-2" />
              Pace
            </div>
            <div className="text-2xl font-bold text-white">{formatPace(pace)}</div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {status === 'IDLE' && (
             <button onClick={startRun} className="flex-1 py-4 bg-brand text-white font-bold text-lg rounded-xl hover:bg-brand-light transition-all shadow-[0_0_20px_rgba(252,76,2,0.4)] flex items-center justify-center gap-2">
                <Play className="w-6 h-6 fill-current" /> GO
             </button>
          )}

          {status === 'RUNNING' && (
             <button onClick={pauseRun} className="flex-1 py-4 bg-yellow-500 text-white font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2">
               <Pause className="w-6 h-6 fill-current" /> Pause
             </button>
          )}

          {status === 'PAUSED' && (
             <>
               <button onClick={resumeRun} className="flex-1 py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2">
                 <Play className="w-6 h-6 fill-current" /> Resume
               </button>
               <button onClick={finishRun} className="flex-1 py-4 bg-red-500 text-white font-bold text-lg rounded-xl hover:bg-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2">
                 <Square className="w-6 h-6 fill-current" /> Finish
               </button>
             </>
          )}
        </div>
      </div>
    </div>
  );
}
