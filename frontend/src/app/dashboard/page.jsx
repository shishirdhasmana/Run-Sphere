'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Flame, MapPin, Route, Loader2, Play } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ActivityFeed from '@/components/ActivityFeed';
import DailyChallenges from '@/components/DailyChallenges';
import { getUser } from '@/lib/auth';


export default function DashboardPage() {
  const user = getUser();

  // Fetch current user stats (streak, total distance, etc)
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/users/profile');
      return res.data;
    }
  });

  // Fetch daily challenges
  const { data: challenges, isLoading: isChallengesLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const res = await api.get('/challenges');
      return res.data;
    }
  });

  // Fetch recent runs
  const { data: runs, isLoading: isRunsLoading } = useQuery({
    queryKey: ['runs'],
    queryFn: async () => {
      const res = await api.get('/runs');
      return res.data;
    }
  });

  if (isProfileLoading || isChallengesLoading || isRunsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
      </div>);

  }

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            {welcomeMessage()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">{user?.username}</span>
          </h1>
          <p className="text-text-secondary">Ready to capture some territory today?</p>
        </div>
        <a href="/dashboard/run" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-light transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(252,76,2,0.3)] w-full md:w-auto">
          <Play className="w-5 h-5 fill-current" />
          Start Run
        </a>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Current Streak"
          value={userProfile?.currentStreak || 0}
          icon={Flame}
          trend="Keep it burning!"
          delayClass="stagger-1" />
        
        <StatCard
          title="Total Distance"
          value={`${(userProfile?.totalDistance || 0).toFixed(1)} km`}
          icon={Route}
          delayClass="stagger-2" />
        
        <StatCard
          title="Territories Owned"
          value={userProfile?.territoriesOwned || 0}
          icon={MapPin}
          trend={userProfile?.territoriesOwned > 0 ? "You're expanding!" : "Capture your first"}
          delayClass="stagger-3" />
        
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Wider for Activity Feed) */}
        <div className="lg:col-span-2">
          <ActivityFeed runs={runs || []} />
        </div>
        
        {/* Right Column (For Daily Challenges) */}
        <div>
          <DailyChallenges challenges={challenges || []} />
        </div>
      </div>
    </div>);

}