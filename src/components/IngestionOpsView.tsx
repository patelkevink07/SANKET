import React, { useState } from 'react';
import {
  Activity,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Zap,
  Server,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { IngestionJob, PlatformType, Post } from '../types';

interface IngestionOpsViewProps {
  jobs: IngestionJob[];
  onTriggerIngestion: (platform: PlatformType) => void;
  isIngesting: boolean;
}

export const IngestionOpsView: React.FC<IngestionOpsViewProps> = ({
  jobs,
  onTriggerIngestion,
  isIngesting,
}) => {
  const [selectedPlatformToCrawl, setSelectedPlatformToCrawl] = useState<PlatformType>('x');

  const platformMeta: Record<PlatformType, { name: string; tier: string; adapter: string; statusDesc: string }> = {
    x: { name: 'X (formerly Twitter)', tier: 'Must-Have (Essential)', adapter: 'tweepy / v2 Enterprise Endpoints', statusDesc: 'Continuous webhook stream + search poll' },
    telegram: { name: 'Telegram Channels', tier: 'Must-Have (Essential)', adapter: 'Telethon / python-telegram-bot MTProto', statusDesc: 'Live broadcast listener & channel dumps' },
    reddit: { name: 'Reddit Discussions', tier: 'Appreciable Addition (Bonus)', adapter: 'PRAW / Pushshift API', statusDesc: 'Subreddit post & comment tree crawler' },
    youtube: { name: 'YouTube Video Comments', tier: 'Appreciable Addition (Bonus)', adapter: 'YouTube Data API v3 commentThreads', statusDesc: 'High-volume transcript & comment parser' },
    instagram: { name: 'Instagram Public Graph', tier: 'Desirable (Good-to-Have)', adapter: 'Meta Graph API / Public Hashtag', statusDesc: 'Rate-limit backoff loop active (4m 20s)' },
    facebook: { name: 'Facebook Public Pages', tier: 'Desirable (Good-to-Have)', adapter: 'Meta Page Public Content Access', statusDesc: 'Scheduled hourly batch crawler' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-teal-400">OPERATIONAL MONITOR // INGESTION LAYER</span>
            <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-800/40">
              Multi-Platform Pipeline Health
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-100">
            Platform Adapters, Rate Limits & Background Worker Status
          </h2>
          <p className="text-xs text-slate-400">
            Monitoring asynchronous ingestion jobs pulling posts, comments, interactions, and raw metadata into PostgreSQL.
          </p>
        </div>

        {/* Manual Ingest Trigger */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPlatformToCrawl}
            onChange={(e) => setSelectedPlatformToCrawl(e.target.value as PlatformType)}
            aria-label="Select social media platform to ingest"
            className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-slate-200 focus:border-teal-500 focus:outline-hidden"
          >
            <option value="x">X (Twitter)</option>
            <option value="telegram">Telegram</option>
            <option value="reddit">Reddit</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
          </select>

          <button
            id="btn-trigger-ingestion"
            disabled={isIngesting}
            onClick={() => onTriggerIngestion(selectedPlatformToCrawl)}
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-950/80 px-3 py-1.5 font-mono text-xs font-semibold text-teal-300 transition-all hover:bg-teal-900 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isIngesting ? 'animate-spin' : ''}`} />
            <span>{isIngesting ? 'Ingesting Batch...' : 'Trigger Ingestion Run'}</span>
          </button>
        </div>
      </div>

      {/* 6 Platforms Status Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => {
          const meta = platformMeta[job.platform_id] || {
            name: job.platform_id,
            tier: 'Source',
            adapter: 'Generic REST',
            statusDesc: 'Active',
          };

          const isHealthy = job.status === 'succeeded' || job.status === 'running';
          const isRateLimited = job.status === 'rate_limited';

          return (
            <div
              key={job.id}
              className={`rounded-xl border p-4 transition-all ${
                isRateLimited
                  ? 'border-amber-500/50 bg-slate-900/90'
                  : isHealthy
                  ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  : 'border-rose-500/50 bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-slate-100 uppercase">{meta.name}</h3>
                  <span className="text-[10px] font-mono text-teal-400">{meta.tier}</span>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold uppercase ${
                    job.status === 'running'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50 animate-pulse'
                      : job.status === 'succeeded'
                      ? 'bg-teal-950 text-teal-300 border border-teal-800/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                  }`}
                >
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-300">
                <div className="font-mono text-[11px] text-slate-400">Adapter: {meta.adapter}</div>
                <div className="mt-1 text-[11px] text-slate-400">{meta.statusDesc}</div>
              </div>

              {/* Rate Limit Remaining Meter */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>API Quota Remaining</span>
                  <span className={job.rate_limit_remaining < 20 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                    {job.rate_limit_remaining}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${job.rate_limit_remaining}%` }}
                    className={`h-full rounded-full ${
                      job.rate_limit_remaining < 20 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-2.5 text-[10px] font-mono text-slate-400">
                <div>
                  <span>Ingested:</span>
                  <div className="font-bold text-slate-200">{job.records_ingested.toLocaleString()} records</div>
                </div>
                <div>
                  <span>Latency:</span>
                  <div className="font-bold text-teal-400">{job.latency_ms}ms</div>
                </div>
              </div>

              {job.error_message && (
                <div className="mt-2.5 rounded bg-amber-950/60 p-2 text-[10px] text-amber-300 border border-amber-800/50">
                  {job.error_message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Database Schema & Async Pipeline Architecture Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Single-Database Unified Architecture (PostgreSQL + pgvector)
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-400">PostgreSQL 16 // SIH-26152 NTRO Spec</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
            <span className="font-mono font-bold text-teal-400">1. Raw Content Layer</span>
            <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
              <code className="text-slate-400">posts (id, platform_id, content, posted_at, raw_json)</code>. JSONB column absorbs platform differences while self-referencing <code className="text-slate-400">parent_post_id</code> reconstructs threads.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
            <span className="font-mono font-bold text-indigo-400">2. Link & Edge Graph</span>
            <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
              <code className="text-slate-400">network_edges (source, target, weight, edge_type)</code>. NetworkX executes betweenness & eigenvector centrality on schedule to keep UI fast.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
            <span className="font-mono font-bold text-amber-400">3. Inference & History</span>
            <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
              <code className="text-slate-400">sentiment_scores</code> & <code className="text-slate-400">demographic_profiles</code> maintain time-series snapshots with confidence metrics (<code className="text-slate-400">0.0 to 1.0</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
