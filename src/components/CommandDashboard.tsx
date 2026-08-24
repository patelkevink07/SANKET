import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  Users,
  Shield,
  ArrowUpRight,
  Share2,
  Sparkles,
  Layers,
  Flame,
  Radio,
  Zap,
} from 'lucide-react';
import { Account, Post, Topic, TrendSnapshot } from '../types';
import { TIME_SERIES_SENTIMENT } from '../data/mockData';
import { SanketLogo } from './SanketLogo';

interface CommandDashboardProps {
  posts: Post[];
  accounts: Account[];
  trends: TrendSnapshot[];
  topics: Topic[];
  onSelectTab: (tab: string) => void;
  onSelectTopic: (topic: string) => void;
  isBotFilterActive: boolean;
}

export const CommandDashboard: React.FC<CommandDashboardProps> = ({
  posts,
  accounts,
  trends,
  topics,
  onSelectTab,
  onSelectTopic,
  isBotFilterActive,
}) => {
  const topTrend = trends[0] || {
    topic_keyword: '#TelecomSecurityBill',
    velocity: 142.5,
    mention_count: 8420,
    rank: 1,
  };

  const highestInfluenceAccount = accounts.find((a) => a.influence_rank === 1) || accounts[0];

  // Calculate sentiment percentages from current posts
  const totalPosts = posts.length || 1;
  const anxiousCount = posts.filter((p) => p.sentiment?.primary_label === 'anxious').length;
  const sarcasticCount = posts.filter((p) => p.sentiment?.primary_label === 'sarcastic').length;
  const supportiveCount = posts.filter((p) => p.sentiment?.primary_label === 'supportive').length;
  const againstCount = posts.filter((p) => p.sentiment?.primary_label === 'against').length;

  const anxiousPct = Math.round((anxiousCount / totalPosts) * 100);
  const sarcasticPct = Math.round((sarcasticCount / totalPosts) * 100);
  const supportivePct = Math.round((supportiveCount / totalPosts) * 100);
  const againstPct = Math.round((againstCount / totalPosts) * 100);

  return (
    <div className="space-y-6">
      {/* Intelligence Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-linear-to-r from-slate-900 via-slate-900 to-slate-950 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-950/40 text-teal-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-teal-400">SANKET FUSED INTELLIGENCE ENGINE</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                4 Signals Co-Mapped
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-slate-800/80 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-amber-400">
                DECODE • ANALYZE • ANTICIPATE
              </span>
              {isBotFilterActive && (
                <span className="rounded-full border border-amber-500/30 bg-amber-950/50 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  Bot Suppression Active (-18% Anxiety Noise)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 sm:text-sm">
              Social Analytics & Network Knowledge Extraction Technology correlating Sentiment, Demographics, Trends, and Link Topology across 6 social platforms.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('ops')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ingestion Health</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Nuanced Sentiment Index */}
        <div
          onClick={() => onSelectTab('sentiment')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-teal-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wider uppercase">Nuanced Emotion Index</span>
            <ArrowUpRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-100">{anxiousPct + againstPct}%</span>
            <span className="text-xs font-medium text-amber-400">Critical Friction</span>
          </div>
          {/* Emotion distribution bar */}
          <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div style={{ width: `${anxiousPct}%` }} className="bg-purple-500" title={`Anxious ${anxiousPct}%`} />
            <div style={{ width: `${sarcasticPct}%` }} className="bg-amber-500" title={`Sarcastic ${sarcasticPct}%`} />
            <div style={{ width: `${againstPct}%` }} className="bg-rose-500" title={`Against ${againstPct}%`} />
            <div style={{ width: `${supportivePct}%` }} className="bg-teal-500" title={`Supportive ${supportivePct}%`} />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-purple-400">Anxious {anxiousPct}%</span>
            <span className="text-amber-400">Sarcastic {sarcasticPct}%</span>
            <span className="text-teal-400">Support {supportivePct}%</span>
          </div>
        </div>

        {/* KPI 2: Top Rising Narrative */}
        <div
          onClick={() => onSelectTab('trends')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-indigo-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wider uppercase">Top Rising Narrative</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="truncate font-mono text-lg font-bold text-indigo-300">{topTrend.topic_keyword}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-rose-950/70 px-2 py-0.5 font-mono text-xs font-semibold text-rose-300">
              +{topTrend.velocity}% velocity
            </span>
            <span className="font-mono text-xs text-slate-400">{topTrend.mention_count.toLocaleString()} mentions</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Predicted trajectory: <span className="font-mono font-semibold text-emerald-400">Rank #1 sustained</span>
          </div>
        </div>

        {/* KPI 3: Key Opinion Leader (KOL) */}
        <div
          onClick={() => onSelectTab('network')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-sky-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wider uppercase">High-Influence Node (KOL)</span>
            <Share2 className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-slate-100">@{highestInfluenceAccount.username}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>{highestInfluenceAccount.display_name}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono text-slate-400">
            <span>Betweenness: 0.942</span>
            <span className="text-teal-400">{highestInfluenceAccount.follower_count.toLocaleString()} reach</span>
          </div>
        </div>

        {/* KPI 4: Ingestion Pipeline Health */}
        <div
          onClick={() => onSelectTab('ops')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wider uppercase">Data Ingestion Rate</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400">8,920</span>
            <span className="text-xs text-slate-400">posts / hr</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-medium text-slate-300">6 Platforms Synced (X, TG, Reddit, YT...)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Avg Latency: 142ms</span>
            <span className="text-emerald-400">99.8% Uptime</span>
          </div>
        </div>
      </div>

      {/* Fused Chronological Timeline: Emotion Breakdown + Topic Spike Markers */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-100">
                Chronological Signal Fusion: Emotion Volume & Narrative Spikes
              </h2>
              <span className="rounded-full bg-teal-950 px-2 py-0.5 text-[10px] font-mono text-teal-300 border border-teal-800/40">
                Timeline Backbone
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Stacked emotion volume ribbons mapped directly alongside narrative surge intensity over the chronological timeline.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Anxious
              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-amber-500" /> Sarcasm
              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-rose-500" /> Oppose
              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-teal-500" /> Support
              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-indigo-400" /> Total Volume
            </div>
          </div>
        </div>

        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={TIME_SERIES_SENTIMENT} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
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
              <Area type="monotone" dataKey="anxious" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} name="Anxious" />
              <Area type="monotone" dataKey="sarcastic" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} name="Sarcastic" />
              <Area type="monotone" dataKey="against" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.35} name="Opposition" />
              <Area type="monotone" dataKey="supportive" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.35} name="Supportive" />
              <Line type="monotone" dataKey="volume" stroke="#818cf8" strokeWidth={2} dot={{ r: 3, fill: '#818cf8' }} name="Post Volume" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Narrative Spike Pins underneath timeline */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
          <span className="text-[11px] font-mono font-medium text-slate-400">Timeline Narrative Anchors:</span>
          {trends.slice(0, 3).map((tr) => (
            <button
              key={tr.id}
              onClick={() => onSelectTopic(tr.topic_keyword)}
              className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <span className="font-mono">{tr.topic_keyword}</span>
              <span className="text-[10px] text-rose-400 font-semibold">+{tr.velocity}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lower Row: Network Topology Preview & Intelligence Digest */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 6 cols: Mini Network Topology Preview */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-100">Influence Topology & KOL Graph</h3>
              </div>
              <button
                onClick={() => onSelectTab('network')}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
              >
                <span>Interactive View</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Interactive node graph identifying Key Opinion Leaders (KOLs) driving narrative flow between X, Telegram, and Reddit.
            </p>

            {/* Quick Node List preview */}
            <div className="mt-4 space-y-2.5">
              {accounts.slice(0, 4).map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => onSelectTab('network')}
                  className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 transition-colors hover:border-slate-700"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs font-bold ${
                      acc.dominant_sentiment === 'anxious' ? 'bg-purple-950 text-purple-300 border border-purple-800/50' :
                      acc.dominant_sentiment === 'sarcastic' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                      acc.dominant_sentiment === 'supportive' ? 'bg-teal-950 text-teal-300 border border-teal-800/50' :
                      'bg-rose-950 text-rose-300 border border-rose-800/50'
                    }`}>
                      #{acc.influence_rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-200">@{acc.username}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] uppercase font-mono text-slate-400">
                          {acc.platform_id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{acc.bio}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-300">
                    <div>{(acc.follower_count / 1000).toFixed(1)}k reach</div>
                    <div className="text-[10px] text-slate-500">{acc.dominant_sentiment}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total Graph: 10 Core Nodes, 9 Cross-Platform Edges</span>
            <button onClick={() => onSelectTab('network')} className="text-teal-400 font-medium hover:underline">
              Launch Force Simulation →
            </button>
          </div>
        </div>

        {/* Right 6 cols: What Changed Since Last Shift (Live Intelligence Digest) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-400" />
                <h3 className="text-sm font-semibold text-slate-100">Live Strategic Intelligence Digest</h3>
              </div>
              <span className="font-mono text-[10px] text-teal-400 bg-teal-950 px-2 py-0.5 rounded-full border border-teal-800/50">
                UPDATED 2m AGO
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-amber-500/20 bg-amber-950/30 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span>Anxiety Spike on Telecom Policy (#TelecomSecurityBill)</span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Post volume surged +142.5% in the last 3 hours following draft clause commentary by @dr_arjun_defense. Co-ordinated retweets by suspected bots (12% of traffic) amplified opposition claims.
                </p>
              </div>

              <div className="rounded-lg border border-teal-500/20 bg-teal-950/30 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-teal-400" />
                  <span>Cross-Platform Subsea Cable Treaty Narrative</span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Telegram channel @bharat_cyber_pulse broadcasted positive analysis regarding Chennai-Singapore undersea corridor resilience, gaining 42K views with 95% supportive sentiment.
                </p>
              </div>

              <div className="rounded-lg border border-purple-500/20 bg-purple-950/30 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                  <Layers className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                  <span>Hinglish Code-Mixed Satire Cluster Active</span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Desi sarcasm account @satire_samrat_in generated 4.5K likes. Standard polarity model flagged text as neutral, but NLP emotion classifier identified 96% sarcasm index.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">SANKET // NTRO Surveillance Classification: TIER-1 STRATEGIC MONITORING</span>
            <button
              onClick={() => onSelectTab('timeline')}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              Examine Ground Truth Feed →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
