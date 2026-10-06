'use client';

import React from 'react';
import { UserRole, UserProfile } from '@/types/logistics';
import { Sparkles, MapPin, Bell, User, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onRoleChange: (role: UserRole) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  unreadCount,
  onOpenNotifications,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-borderBrand px-4 lg:px-10 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Wordmark & Location */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-ink flex items-center">
              logiflow
              <span className="text-primary text-xl lg:text-2xl ml-0.5">✦</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary ml-1 animate-pulse" />
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-secondaryBrand/70 rounded-full text-xs font-medium text-ink/80 border border-borderBrand/60">
            <MapPin className="w-3.5 h-3.5 text-primary-dark" />
            <span>ACCRA & TEMA LOGISTICS HUB, GHANA</span>
          </div>
        </div>

        {/* Right Controls: Role Switcher, Notifications, Demo reset */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Reset */}
          <button
            onClick={onResetData}
            title="Reset to default Ghanaian startup dataset"
            className="hidden sm:flex items-center gap-1.5 text-xs text-mutedBrand hover:text-ink px-2.5 py-1.5 rounded-lg border border-borderBrand/70 hover:bg-secondaryBrand/50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          {/* Africa's Talking / In-App Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-ink hover:bg-secondaryBrand/80 border border-borderBrand/80 transition"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-ink" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-[10px] font-bold bg-primary text-ink rounded-full border border-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-borderBrand">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-ink leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-mutedBrand uppercase tracking-wider font-mono">
                {currentUser.role}
              </span>
            </div>

            <div className="relative">
              <select
                value={currentUser.role}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-xs font-medium bg-secondaryBrand/80 hover:bg-secondaryBrand text-ink border border-borderBrand rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-dark cursor-pointer transition"
                aria-label="Switch operational role"
              >
                <option value="manager">Role: Operations Manager</option>
                <option value="admin">Role: Founder / Admin</option>
                <option value="staff">Role: Warehouse Staff</option>
                <option value="rider">Role: Dispatch Rider</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
