'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { Loader2, Route, Timer, MapIcon, Calendar, Activity } from 'lucide-react';


export default function RunsPage() {
  const { data: runs, isLoading } = useQuery({
    queryKey: ['runs'],
    queryFn: async () => {
      const res = await api.get('/runs');
      return res.data;
    }
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Run History</h1>
        <p className="text-text-secondary">Your journey, step by step, hexagon by hexagon.</p>
      </div>

      {isLoading ?
      <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div> :
      !runs || runs.length === 0 ?
      <div className="glass-card p-12 text-center animate-fade-in-up stagger-1">
          <div className="w-20 h-20 bg-[#1f1f1f] rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No runs yet</h2>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            Start tracking your runs to capture territories and build your empire in Dehradun.
          </p>
          <button className="btn-primary" onClick={() => alert('Download the mobile app to start tracking runs!')}>
            Start Your First Run
          </button>
        </div> :

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#2a2a2a] before:to-transparent">
          {runs.map((run, index) => {
          const durationMs = new Date(run.endTime).getTime() - new Date(run.startTime).getTime();
          const durationMins = Math.round(durationMs / 60000);
          const pace = run.averagePace || (durationMins / (run.totalDistance || 1));

          return (
            <div key={run._id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-fade-in-up stagger-${index % 5 + 1}`}>
                
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#2a2a2a] bg-black group-hover:bg-[#141414] group-hover:border-brand shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-brand transition-colors z-10">
                  <Route className="w-4 h-4" />
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-brand text-sm font-semibold">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={run.createdAt}>{format(new Date(run.createdAt), 'MMM d, yyyy')}</time>
                    </div>
                    <span className="text-xs text-text-secondary bg-[#1f1f1f] px-2 py-1 rounded-md">
                      {format(new Date(run.startTime), 'h:mm a')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Distance</p>
                      <p className="text-xl font-bold text-white">{(run.totalDistance || 0).toFixed(2)} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Duration</p>
                      <p className="text-xl font-bold text-white flex items-center gap-1">
                        {durationMins}m
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a2a2a]">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Avg Pace</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1">
                        <Timer className="w-3 h-3 text-indigo-400" />
                        {Math.floor(pace)}:{Math.round(pace % 1 * 60).toString().padStart(2, '0')} /km
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Territories</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1">
                        <MapIcon className="w-3 h-3 text-emerald-400" />
                        +{run.territoriesCaptured?.length || 0} Captured
                      </p>
                    </div>
                  </div>
                </div>
              </div>);

        })}
        </div>
      }
    </div>);

}