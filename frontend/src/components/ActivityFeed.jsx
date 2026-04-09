'use client';
import { formatDistanceToNow } from 'date-fns';
import { Route, Map as MapIcon, Timer, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function ActivityFeed({ runs }) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/runs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const handleDelete = (id) => {
    if (confirm('Delete this run?')) deleteMutation.mutate(id);
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up stagger-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <Link href="/dashboard/runs" className="text-sm text-brand hover:text-brand-light transition-colors">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {runs.length === 0 ? (
          <div className="text-center py-8">
            <Route className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
            <p className="text-text-secondary">No runs recorded yet.</p>
            <p className="text-sm text-[#4f4f4f] mt-1">Go out and capture your first territory!</p>
          </div>
        ) : (
          runs.slice(0, 5).map((run) => {
            const durationMs = new Date(run.endTime).getTime() - new Date(run.startTime).getTime();
            const durationMins = Math.round(durationMs / 60000);

            return (
              <div
                key={run._id}
                className="group p-4 bg-black/40 border border-[#2a2a2a] rounded-xl hover:border-[#3f3f3f] transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{run.name || 'Untitled Run'}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary">
                      {formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}
                    </span>
                    <button onClick={() => handleDelete(run._id)} className="text-[#4f4f4f] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Delete run">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Route className="w-4 h-4 text-brand" />
                    <span className="font-medium text-text-primary">{(run.totalDistance || 0).toFixed(2)} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Timer className="w-4 h-4 text-indigo-400" />
                    <span>{durationMins} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapIcon className="w-4 h-4 text-emerald-400" />
                    <span>{run.territoriesCaptured?.length || 0} captured</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}