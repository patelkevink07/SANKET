import React from 'react';
import { Shield, Radio, Sparkles, Filter, Search, Bot, Clock, AlertTriangle, Layers } from 'lucide-react';
import { FilterState, PlatformType, PrimarySentiment } from '../types';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenLiveAiModal: () => void;
  onOpenBriefModal: () => void;
  postCount: number;
}

const PLATFORMS: { id: PlatformType; label: string; iconBg: string }[] = [
  { id: 'x', label: 'X (Twitter)', iconBg: 'bg-neutral-800' },
  { id: 'telegram', label: 'Telegram', iconBg: 'bg-sky-950 text-sky-400' },
  { id: 'reddit', label: 'Reddit', iconBg: 'bg-amber-950 text-amber-400' },
  { id: 'youtube', label: 'YouTube', iconBg: 'bg-rose-950 text-rose-400' },
  { id: 'instagram', label: 'Instagram', iconBg: 'bg-pink-950 text-pink-400' },
  { id: 'facebook', label: 'Facebook', iconBg: 'bg-blue-950 text-blue-400' },
];

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  activeTab,
  onTabChange,
  onOpenLiveAiModal,
  onOpenBriefModal,
  postCount,
}) => {
  const togglePlatform = (p: PlatformType) => {
    let newPlatforms: PlatformType[];
    if (filters.platforms.includes(p)) {
      if (filters.platforms.length === 1) {
        newPlatforms = ['x', 'telegram', 'reddit', 'youtube', 'instagram', 'facebook'];
      } else {
        newPlatforms = filters.platforms.filter((item) => item !== p);
      }
    } else {
      newPlatforms = [...filters.platforms, p];
    }
    onFilterChange({ ...filters, platforms: newPlatforms });
  };

  const navItems = [
    { id: 'command', label: 'Command Center', icon: Layers },
    { id: 'sentiment', label: 'Sentiment & Emotion', badge: 'Nuanced' },
    { id: 'demographics', label: 'Demographics', badge: 'Inferred' },
    { id: 'trends', label: 'Trends & Topics', badge: 'Predictive' },
    { id: 'network', label: 'Network & KOLs', badge: 'Graph' },
    { id: 'timeline', label: 'Timeline Explorer', badge: `${postCount}` },
    { id: 'ops', label: 'Ingestion & Ops', badge: '6 Active' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* Top Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-950/50 text-teal-400 shadow-sm shadow-teal-500/10">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-teal-400">NTRO // SIH-26152</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                <Radio className="h-2.5 w-2.5 animate-pulse text-emerald-400" />
                STREAM ACTIVE
              </span>
            </div>
            <h1 className="text-sm font-semibold text-slate-100 sm:text-base">
              Social Media Analytics & Audience Intelligence Framework
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-live-ai-infer"
            onClick={onOpenLiveAiModal}
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-950/60 px-3 py-1.5 text-xs font-medium text-teal-300 transition-all hover:bg-teal-900/60 hover:text-teal-200"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>AI Post Inference</span>
          </button>

          <button
            id="btn-intel-brief"
            onClick={onOpenBriefModal}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/60 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-all hover:bg-indigo-900/60 hover:text-indigo-200"
          >
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Situation Brief</span>
            <span className="sm:hidden">Brief</span>
          </button>

          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-right text-xs md:flex">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="text-left font-mono leading-tight">
              <div className="text-[10px] text-slate-400">Analyst #419</div>
              <div className="text-xs font-semibold text-slate-200">Govt SOC Tier-1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="border-t border-slate-800/80 bg-slate-900/70 px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5">
          {/* Platform Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium tracking-wide uppercase text-slate-400">Sources:</span>
            {PLATFORMS.map((p) => {
              const active = filters.platforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  id={`btn-filter-platform-${p.id}`}
                  onClick={() => togglePlatform(p.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    active
                      ? 'border border-teal-500/40 bg-teal-950/60 text-teal-300 shadow-xs'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Search, Time & Bot Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute top-2 left-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="input-global-search"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                placeholder="Search topics, #hashtag, bio, handle..."
                className="w-44 rounded-md border border-slate-800 bg-slate-950/80 py-1 pr-3 pl-8 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-hidden sm:w-56"
              />
            </div>

            {/* Time Window */}
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <select
                id="select-time-window"
                value={filters.timeWindow}
                onChange={(e) => onFilterChange({ ...filters, timeWindow: e.target.value as any })}
                aria-label="Filter timeline window"
                className="rounded-md border border-slate-800 bg-slate-950 py-1 pr-6 pl-2 font-mono text-xs text-slate-200 focus:border-teal-500 focus:outline-hidden"
              >
                <option value="1h">Last 1 Hour (Live)</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {/* Bot Exclusion Toggle */}
            <button
              id="btn-toggle-bot-filter"
              onClick={() => onFilterChange({ ...filters, excludeBots: !filters.excludeBots })}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                filters.excludeBots
                  ? 'border border-amber-500/40 bg-amber-950/60 text-amber-300'
                  : 'border border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
              title="Toggle filter for suspected inauthentic/bot accounts"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>{filters.excludeBots ? 'Bots Excluded' : 'Include Bots'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-b-2 border-teal-400 bg-slate-900 text-teal-300'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive ? 'bg-teal-950 text-teal-300 border border-teal-800/50' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
