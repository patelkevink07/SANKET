import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Flame,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Filter,
  Tag,
  Clock,
  Layers,
} from 'lucide-react';
import { Post, Topic, TrendSnapshot } from '../types';

interface TrendsViewProps {
  trends: TrendSnapshot[];
  topics: Topic[];
  posts: Post[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  onNavigateToTimeline: () => void;
}

export const TrendsView: React.FC<TrendsViewProps> = ({
  trends,
  topics,
  posts,
  selectedTopic,
  onSelectTopic,
  onNavigateToTimeline,
}) => {
  const currentTopic = selectedTopic || trends[0]?.topic_keyword || '#TelecomSecurityBill';

  const activeTrend = trends.find(
    (t) => t.topic_keyword.toLowerCase() === currentTopic.toLowerCase()
  ) || trends[0];

  const drivingPosts = posts.filter(
    (p) => p.topics.some((tp) => tp.toLowerCase().includes(currentTopic.toLowerCase().replace('#', '')) ||
                              currentTopic.toLowerCase().includes(tp.toLowerCase().replace('#', '')))
  );

  // Sparkline data for current trend trajectory
  const sparklineData = (activeTrend?.trajectory || [100, 200, 400, 800, 1600, 3200]).map(
    (val, i) => ({ step: `T-${6 - i}h`, mentions: val })
  );

  return (
    <div className="space-y-6">
      {/* Component D Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-teal-400">COMPONENT D // NARRATIVE ENGINE</span>
            <span className="rounded-full bg-indigo-950 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-800/40">
              Chronological & Predictive Trend Detection
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-100">
            Real-Time Trend Ranking, Velocity Spikes & Trajectory Forecasts
          </h2>
          <p className="text-xs text-slate-400">
            Identifying emerging narratives chronologically and forecasting momentum before virality saturates the network.
          </p>
        </div>
      </div>

      {/* Main Grid: Trends Leaderboard & Trend Deep Dive */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 5 cols: Ranked Trend Leaderboard */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-slate-100">Ranked Narrative Stream</h3>
            </div>
            <span className="font-mono text-[10px] text-slate-400">Window: 6-Hour Delta</span>
          </div>

          <div className="mt-4 space-y-3">
            {trends.map((t) => {
              const isSelected = currentTopic.toLowerCase() === t.topic_keyword.toLowerCase();
              const isPositiveVelocity = t.velocity >= 0;

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t.topic_keyword)}
                  className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                    isSelected
                      ? 'border-indigo-500/80 bg-slate-950 shadow-md shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold bg-slate-800 text-slate-200">
                        #{t.rank}
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-100">{t.topic_keyword}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold">
                      {isPositiveVelocity ? (
                        <span className="flex items-center text-rose-400">
                          <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
                          +{t.velocity}%
                        </span>
                      ) : (
                        <span className="flex items-center text-slate-400">
                          <TrendingDown className="mr-0.5 h-3.5 w-3.5" />
                          {t.velocity}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                      {t.category}
                    </span>
                    <span className="font-mono">{t.mention_count.toLocaleString()} mentions</span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px] font-mono">
                    <span className="text-slate-500">Predicted Next Rank:</span>
                    <span className="font-semibold text-emerald-400">
                      #{t.predicted_next_rank} {t.predicted_next_rank < t.rank ? '▲ RISING' : t.predicted_next_rank === t.rank ? '■ STEADY' : '▼ COOLING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 cols: Topic Trajectory & Driving Posts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-indigo-300">{activeTrend?.topic_keyword}</span>
                  <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-800/40">
                    {activeTrend?.category}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Chronological velocity: <span className="text-rose-400 font-bold font-mono">+{activeTrend?.velocity}%</span> • Total Volume: <span className="font-mono font-bold text-slate-200">{activeTrend?.mention_count.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onNavigateToTimeline}
                className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-slate-100"
              >
                <Filter className="h-3.5 w-3.5 text-teal-400" />
                <span>Filter Timeline to Topic</span>
              </button>
            </div>

            {/* Trajectory Sparkline Graph */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Mentions Trajectory (Last 6 Hours)</span>
                <span className="font-mono text-emerald-400">Next Window Forecast: +2,400 mentions</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="step" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Line type="monotone" dataKey="mentions" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Driving Posts Section */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Key Posts Driving Narrative Velocity ({drivingPosts.length} matches)
              </h4>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {drivingPosts.length > 0 ? (
                  drivingPosts.map((p) => (
                    <div key={p.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-200">
                            {p.account?.display_name || 'Observed Author'}
                          </span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] uppercase font-mono text-slate-400">
                            {p.platform_id}
                          </span>
                        </div>
                        <span className={`rounded px-1.5 py-0.2 text-[10px] font-mono uppercase ${
                          p.sentiment?.primary_label === 'anxious' ? 'bg-purple-950 text-purple-300' :
                          p.sentiment?.primary_label === 'sarcastic' ? 'bg-amber-950 text-amber-300' :
                          p.sentiment?.primary_label === 'supportive' ? 'bg-teal-950 text-teal-300' :
                          'bg-rose-950 text-rose-300'
                        }`}>
                          {p.sentiment?.primary_label}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {p.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{new Date(p.posted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{p.like_count} likes • {p.share_count} shares</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No individual post matches for this topic filter in the active time window.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
