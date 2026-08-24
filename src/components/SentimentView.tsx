import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Smile,
  Frown,
  AlertTriangle,
  Flame,
  Zap,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle,
  MessageSquare,
  Shield,
} from 'lucide-react';
import { Post, PrimarySentiment } from '../types';
import { TIME_SERIES_SENTIMENT } from '../data/mockData';

interface SentimentViewProps {
  posts: Post[];
  onOpenLiveAiModal: () => void;
}

export const SentimentView: React.FC<SentimentViewProps> = ({ posts, onOpenLiveAiModal }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<PrimarySentiment | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(posts[0] || null);

  const filteredPosts = selectedEmotion === 'all'
    ? posts
    : posts.filter((p) => p.sentiment?.primary_label === selectedEmotion);

  const emotionBreakdown = [
    { name: 'Anxiety', value: 38, count: posts.filter(p => p.sentiment?.primary_label === 'anxious').length, color: '#a855f7', desc: 'Worry about privacy, surveillance, or policy overreach' },
    { name: 'Sarcasm', value: 24, count: posts.filter(p => p.sentiment?.primary_label === 'sarcastic').length, color: '#f59e0b', desc: 'Code-mixed Hinglish mockery, satirical agreement' },
    { name: 'Opposition', value: 20, count: posts.filter(p => p.sentiment?.primary_label === 'against').length, color: '#f43f5e', desc: 'Direct pushback, petitions, hashtag boycotts' },
    { name: 'Supportive', value: 22, count: posts.filter(p => p.sentiment?.primary_label === 'supportive').length, color: '#14b8a6', desc: 'Endorsement of sovereign security, national infrastructure' },
    { name: 'Excitement', value: 16, count: posts.filter(p => p.sentiment?.primary_label === 'excited').length, color: '#38bdf8', desc: 'Enthusiasm for quantum crypto, tech treaties, breakthroughs' },
  ];

  // Radar chart data for the selected post
  const radarData = selectedPost?.sentiment
    ? [
        { metric: 'Sarcasm', value: Math.round(selectedPost.sentiment.sarcasm_score * 100), fullMark: 100 },
        { metric: 'Anxiety', value: Math.round(selectedPost.sentiment.anxiety_score * 100), fullMark: 100 },
        { metric: 'Opposition', value: Math.round(selectedPost.sentiment.opposition_score * 100), fullMark: 100 },
        { metric: 'Support', value: Math.round(selectedPost.sentiment.support_score * 100), fullMark: 100 },
        { metric: 'Excitement', value: Math.round(selectedPost.sentiment.excitement_score * 100), fullMark: 100 },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Component B Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-teal-400">COMPONENT B // NLP PIPELINE</span>
            <span className="rounded-full bg-teal-950 px-2 py-0.5 text-[10px] font-mono text-teal-300 border border-teal-800/40">
              Multi-Dimensional Emotion Inference
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-100">
            Nuanced Emotional Spectrum Analysis (Beyond Flat Polarity)
          </h2>
          <p className="text-xs text-slate-400">
            Evaluating complex human sentiment — sarcasm, anxiety, excitement, support, and opposition — with confidence metrics and timeline tracking.
          </p>
        </div>
        <button
          onClick={onOpenLiveAiModal}
          className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-950/60 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-900/60"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-400" />
          <span>Test Custom Hinglish / Post</span>
        </button>
      </div>

      {/* Sarcasm & Hinglish Intelligence Callout Box */}
      <div className="rounded-xl border border-amber-500/30 bg-linear-to-r from-amber-950/30 via-slate-900 to-slate-900 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/60 text-amber-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-300">
                PRD Edge Case Solved: Hinglish Code-Mixed Text & Sarcasm Disambiguation
              </span>
              <span className="rounded bg-amber-950 px-1.5 py-0.2 text-[10px] font-mono text-amber-400 border border-amber-800/50">
                Model: HuggingFace RoBERTa Multi-Task
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Conventional polarity models fail on phrases like <em>"Wah bhai wah! Sahi hai boss..."</em> because surface words appear positive. Our fine-tuned contextual model scores sarcasm at <strong>96%</strong> with an inverse polarity index (-0.52), preventing false-positive intelligence flags.
            </p>
          </div>
        </div>
      </div>

      {/* Emotion Categories Filter Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {emotionBreakdown.map((em) => {
          const isSelected = selectedEmotion === (em.name.toLowerCase() as PrimarySentiment);
          return (
            <div
              key={em.name}
              onClick={() => setSelectedEmotion(isSelected ? 'all' : (em.name.toLowerCase() as PrimarySentiment))}
              className={`cursor-pointer rounded-xl border p-3 transition-all ${
                isSelected
                  ? 'border-teal-400 bg-slate-900 shadow-md shadow-teal-500/10'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{em.name}</span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: em.color }} />
              </div>
              <div className="mt-2 font-mono text-xl font-bold text-slate-100">{em.value}%</div>
              <div className="mt-1 text-[11px] text-slate-400 line-clamp-1">{em.desc}</div>
              <div className="mt-2 text-[10px] font-mono text-teal-400">
                {em.count} driving posts active
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Emotion Timeline & Deep Inspection Radar Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 cols: Emotion Timeline Fluctuation */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Emotion Fluctuation Along the Timeline</h3>
              <p className="text-xs text-slate-400">Chronological trajectory of each emotional dimension</p>
            </div>
            <span className="font-mono text-xs text-slate-400">24-Hour Resolution</span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIME_SERIES_SENTIMENT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
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
                <Legend />
                <Area type="monotone" dataKey="anxious" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} name="Anxiety" />
                <Area type="monotone" dataKey="sarcastic" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} name="Sarcasm" />
                <Area type="monotone" dataKey="against" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.25} name="Opposition" />
                <Area type="monotone" dataKey="supportive" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} name="Support" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 cols: Nuance Radar for Selected Post */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100">Deep Emotion Fingerprint</h3>
              {selectedPost?.sentiment && (
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                  Confidence: {Math.round(selectedPost.sentiment.confidence * 100)}%
                </span>
              )}
            </div>

            {selectedPost ? (
              <div>
                <div className="mt-3 h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <PolarRadiusAxis stroke="#64748b" angle={30} domain={[0, 100]} />
                      <Radar name="Emotion Score" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      Primary Label: <span className="uppercase text-teal-400">{selectedPost.sentiment?.primary_label}</span>
                    </span>
                    <span className="font-mono text-slate-400">
                      Net Polarity: {selectedPost.sentiment?.polarity_score}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2 italic">
                    "{selectedPost.content}"
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Model: {selectedPost.sentiment?.model_version}</span>
                    <span>Lang: {selectedPost.language}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">Select a post below to view its emotion radar.</div>
            )}
          </div>
        </div>
      </div>

      {/* Driving Posts Table with Granular Emotion Sliders */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Posts Driving Nuanced Emotion ({filteredPosts.length} Results)
            </h3>
            <p className="text-xs text-slate-400">
              Click any post to inspect its individual emotion radar and metadata
            </p>
          </div>
          {selectedEmotion !== 'all' && (
            <button
              onClick={() => setSelectedEmotion('all')}
              className="text-xs text-teal-400 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {filteredPosts.map((p) => {
            const isCurrent = selectedPost?.id === p.id;
            const sent = p.sentiment;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPost(p)}
                className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                  isCurrent
                    ? 'border-teal-500/60 bg-slate-950 shadow-sm'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-200">
                      {p.account?.display_name || 'Anonymous Observed User'}
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono text-slate-400 uppercase">
                      {p.platform_id}
                    </span>
                    {p.language === 'hi-en' && (
                      <span className="rounded bg-amber-950 border border-amber-800/50 px-1.5 py-0.2 text-[10px] font-mono text-amber-300">
                        Hinglish Code-Mixed
                      </span>
                    )}
                    {sent?.sarcasm_score && sent.sarcasm_score > 0.8 && (
                      <span className="rounded bg-amber-900/60 px-1.5 py-0.2 text-[10px] font-semibold text-amber-200">
                        🎭 Sarcasm Detected ({Math.round(sent.sarcasm_score * 100)}%)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold uppercase ${
                      sent?.primary_label === 'anxious' ? 'bg-purple-950 text-purple-300 border border-purple-800/40' :
                      sent?.primary_label === 'sarcastic' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                      sent?.primary_label === 'supportive' ? 'bg-teal-950 text-teal-300 border border-teal-800/40' :
                      'bg-rose-950 text-rose-300 border border-rose-800/40'
                    }`}>
                      {sent?.primary_label}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      Conf: {Math.round((sent?.confidence || 0.85) * 100)}%
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-200 leading-relaxed">{p.content}</p>

                {/* Emotion Sliders row */}
                {sent && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2.5 sm:grid-cols-5 text-[10px] font-mono">
                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>Sarcasm</span>
                        <span className="text-amber-400">{Math.round(sent.sarcasm_score * 100)}%</span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded bg-slate-800">
                        <div style={{ width: `${sent.sarcasm_score * 100}%` }} className="h-full bg-amber-500 rounded" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>Anxiety</span>
                        <span className="text-purple-400">{Math.round(sent.anxiety_score * 100)}%</span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded bg-slate-800">
                        <div style={{ width: `${sent.anxiety_score * 100}%` }} className="h-full bg-purple-500 rounded" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>Opposition</span>
                        <span className="text-rose-400">{Math.round(sent.opposition_score * 100)}%</span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded bg-slate-800">
                        <div style={{ width: `${sent.opposition_score * 100}%` }} className="h-full bg-rose-500 rounded" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>Support</span>
                        <span className="text-teal-400">{Math.round(sent.support_score * 100)}%</span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded bg-slate-800">
                        <div style={{ width: `${sent.support_score * 100}%` }} className="h-full bg-teal-500 rounded" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>Excitement</span>
                        <span className="text-sky-400">{Math.round(sent.excitement_score * 100)}%</span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded bg-slate-800">
                        <div style={{ width: `${sent.excitement_score * 100}%` }} className="h-full bg-sky-500 rounded" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
