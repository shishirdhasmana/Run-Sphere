'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Map as MapIcon, History, LogOut, Hexagon, User } from 'lucide-react';
import { logout } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/users/profile').then(res => setUser(res.data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Territory Map', href: '/dashboard/map', icon: MapIcon },
  { name: 'Run History', href: '/dashboard/runs', icon: History },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Hexagon }];


  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#141414]/90 backdrop-blur-xl border-r border-[#2a2a2a] flex flex-col z-50 animate-slide-in-left">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#2a2a2a]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Hexagon className="w-8 h-8 text-brand animate-pulse-glow" strokeWidth={2} />
          <span className="text-xl font-bold tracking-tight text-white">RunSphere</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive ?
              'bg-brand/10 text-brand font-medium shadow-[inset_4px_0_0_0_#FC4C02]' :
              'text-text-secondary hover:bg-[#1f1f1f] hover:text-white'}`
              }>
              
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand' : ''}`} />
              {item.name}
            </Link>);

        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center border border-brand/30">
            <User className="w-5 h-5 text-brand" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user?.username || 'Runner'}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors">
          
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>);

}