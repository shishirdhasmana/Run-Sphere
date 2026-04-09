'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Trophy, Medal, Hexagon, Route, Loader2 } from 'lucide-react';
import { getUser } from '@/lib/auth';










export default function LeaderboardPage() {
  const currentUser = getUser();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await api.get('/leaderboard');
      return res.data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-brand" />
          Global Leaderboard
        </h1>
        <p className="text-text-secondary text-lg">
          Compete against runners worldwide to capture the most territory.
        </p>
      </header>

      {/* Podium Section (Top 3) */}
      {!isLoading && leaderboard && leaderboard.length >= 3 &&
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mt-12 mb-16 h-64">
          {/* Rank 2 */}
          <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-full bg-slate-300/20 border-4 border-slate-300 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">2</span>
            </div>
            <p className="text-white font-medium mb-2">{leaderboard[1].username}</p>
            <div className="w-24 h-32 bg-slate-800/80 rounded-t-xl border border-slate-700/50 flex flex-col justify-end p-4 shadow-[0_0_30px_rgba(203,213,225,0.1)]">
              <span className="text-center font-bold text-slate-300">{leaderboard[1].territoriesOwned}</span>
              <span className="text-center text-xs text-text-secondary">Hexagons</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="relative">
              <Medal className="w-12 h-12 text-yellow-500 absolute -top-8 -right-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-4 border-yellow-500 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
            </div>
            <p className="text-white font-bold mb-2">{leaderboard[0].username}</p>
            <div className="w-28 h-40 bg-gradient-to-t from-yellow-900/40 to-yellow-600/20 rounded-t-xl border border-yellow-500/30 flex flex-col justify-end p-4 shadow-[0_0_40px_rgba(234,179,8,0.15)] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-transparent via-yellow-500/10 to-transparent translate-y-full hover:translate-y-[-100%] transition-transform duration-1000" />
              <span className="text-center font-bold text-yellow-500 text-xl">{leaderboard[0].territoriesOwned}</span>
              <span className="text-center text-xs text-text-secondary">Hexagons</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 rounded-full bg-orange-700/20 border-4 border-orange-700 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <p className="text-white font-medium mb-2">{leaderboard[2].username}</p>
            <div className="w-24 h-24 bg-slate-800/80 rounded-t-xl border border-slate-700/50 flex flex-col justify-end p-4 shadow-[0_0_30px_rgba(194,65,12,0.1)]">
              <span className="text-center font-bold text-orange-400">{leaderboard[2].territoriesOwned}</span>
              <span className="text-center text-xs text-text-secondary">Hexagons</span>
            </div>
          </div>
        </div>
      }

      {/* Main Leaderboard Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ?
        <div className="p-12 flex flex-col items-center justify-center text-text-secondary">
            <Loader2 className="w-8 h-8 animate-spin text-brand mb-4" />
            <p>Scanning global ranks...</p>
          </div> :
        !leaderboard || leaderboard.length === 0 ?
        <div className="p-12 text-center text-text-secondary">
            <Trophy className="w-12 h-12 opacity-20 mx-auto mb-4" />
            <p>No runners on the leaderboard yet. Be the first!</p>
          </div> :

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-text-secondary text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Runner</th>
                  <th className="px-6 py-4 font-medium text-right">Territories</th>
                  <th className="px-6 py-4 font-medium text-right">Distance (km)</th>
                  <th className="px-6 py-4 font-medium text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {leaderboard.map((user) => {
                const isCurrentUser = currentUser?.id === user._id;

                return (
                  <tr
                    key={user._id}
                    className={`hover:bg-[#1a1a1a] transition-colors ${
                    isCurrentUser ? 'bg-brand/5' : ''}`
                    }>
                    
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold
                          ${user.rank === 1 ? 'bg-yellow-500 text-black' :
                      user.rank === 2 ? 'bg-slate-300 text-black' :
                      user.rank === 3 ? 'bg-orange-700 text-white' :
                      'text-text-secondary bg-[#1f1f1f]'}
                        `
                      }>
                          {user.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={`font-semibold ${isCurrentUser ? 'text-brand' : 'text-white'}`}>
                            {user.username}
                          </span>
                          {isCurrentUser &&
                        <span className="px-2 py-0.5 rounded-full bg-brand/20 text-brand text-xs font-medium">
                              You
                            </span>
                        }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-white">
                        <div className="flex items-center justify-end gap-2">
                          {user.territoriesOwned}
                          <Hexagon className={`w-4 h-4 ${user.territoriesOwned > 0 ? 'text-brand fill-brand/20' : 'text-text-secondary'}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-text-secondary">
                        <div className="flex items-center justify-end gap-2">
                          {user.totalDistance.toFixed(1)}
                          <Route className="w-4 h-4 opacity-50" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-text-secondary">
                        {user.currentStreak > 0 ?
                      <span className="flex items-center justify-end gap-1 text-orange-400">
                            {user.currentStreak} 🔥
                          </span> :

                      '-'
                      }
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>);

}