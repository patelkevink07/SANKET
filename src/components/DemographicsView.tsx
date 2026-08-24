import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Users,
  MapPin,
  Briefcase,
  Globe,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import {
  DEMOGRAPHIC_AGE_DISTRIBUTION,
  DEMOGRAPHIC_GEO_DISTRIBUTION,
  DEMOGRAPHIC_LANG_DISTRIBUTION,
  DEMOGRAPHIC_PROFESSIONS,
} from '../data/mockData';

export const DemographicsView: React.FC = () => {
  const AGE_COLORS = ['#38bdf8', '#14b8a6', '#f59e0b', '#a855f7', '#f43f5e'];
  const LANG_COLORS = ['#f59e0b', '#38bdf8', '#14b8a6', '#a855f7'];

  return (
    <div className="space-y-6">
      {/* Component C Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-teal-400">COMPONENT C // PROFILING ENGINE</span>
            <span className="rounded-full bg-teal-950 px-2 py-0.5 text-[10px] font-mono text-teal-300 border border-teal-800/40">
              Automated Demographic Inference
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-100">
            Anonymized Aggregate Audience Demographics
          </h2>
          <p className="text-xs text-slate-400">
            Inferring age brackets, geographic hubs, language dialect mix, and professional interest clusters purely from public bios and behavioral metadata.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/50 px-3 py-1.5 text-xs font-mono text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Zero PII // Differential Privacy Guard</span>
        </div>
      </div>

      {/* Confidence Policy & Abstain-or-Flag Banner */}
      <div className="rounded-xl border border-sky-500/30 bg-linear-to-r from-sky-950/30 via-slate-900 to-slate-900 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-950/60 text-sky-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-300">
                Methodological Safeguard: Explicit Confidence Bands (Abstain-or-Flag Policy)
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              To avoid misleading tactical conclusions, demographic inferences are stored with explicit confidence intervals (<code className="text-sky-300 font-mono">0.0 to 1.0</code>). Profiles with confidence below 0.60 are marked as <em>"Uncertain / Sparse Signal"</em> rather than coerced into inaccurate demographic brackets.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Age Brackets & Geographic Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 6 cols: Age Brackets with Confidence Bands */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-slate-100">Inferred Age Bracket Distribution</h3>
            </div>
            <span className="font-mono text-[10px] text-slate-400">Sample: 87,700 Profiles</span>
          </div>

          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMOGRAPHIC_AGE_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="age" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any, name: any, item: any) => [
                    `${value}% (Confidence: ${Math.round(item.payload.confidence * 100)}%)`,
                    'Share',
                  ]}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {DEMOGRAPHIC_AGE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-1 border-t border-slate-800/80 pt-3 text-center text-[10px] font-mono">
            {DEMOGRAPHIC_AGE_DISTRIBUTION.map((d, i) => (
              <div key={d.age} className="rounded bg-slate-950 p-1">
                <div className="text-slate-400">{d.age}</div>
                <div className="font-bold text-slate-200">{d.percentage}%</div>
                <div className="text-[9px] text-teal-400">{(d.confidence * 100).toFixed(0)}% conf</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Geographic Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-100">Geographic & Regional Hubs</h3>
              </div>
              <span className="font-mono text-[10px] text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/40">
                IP Geolocation & Bio Parsing
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {DEMOGRAPHIC_GEO_DISTRIBUTION.map((g) => (
                <div key={g.region} className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{g.region}</span>
                    <span className="font-mono font-bold text-teal-400">{g.percentage}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${g.percentage}%` }}
                      className="h-full bg-sky-500 rounded-full"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Confidence: {Math.round(g.confidence * 100)}%</span>
                    <span className={`px-1.5 py-0.2 rounded font-semibold ${
                      g.alertLevel === 'HIGH' ? 'bg-rose-950 text-rose-300' :
                      g.alertLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {g.alertLevel} ACTIVITY
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Language & Code-Mixed Distribution + Professional Interest Clusters */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 6 cols: Language Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-100">Language & Dialect Composition</h3>
            </div>
            <span className="font-mono text-[10px] text-amber-400">Hinglish Majority (46%)</span>
          </div>

          <div className="mt-4 space-y-3">
            {DEMOGRAPHIC_LANG_DISTRIBUTION.map((lang, index) => (
              <div key={lang.language} className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LANG_COLORS[index] }} />
                    <span className="font-medium text-slate-200">{lang.language}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">{lang.percentage}%</span>
                </div>
                <div className="mt-1.5 text-[11px] text-slate-400 italic">
                  Snippet: "{lang.sample}"
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Language Confidence: {Math.round(lang.confidence * 100)}%</span>
                  <span>ISO Sub-tagger: active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Professional Interest Clusters */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-slate-100">Professional Interest Clusters</h3>
            </div>
            <span className="font-mono text-[10px] text-purple-400">Bio & Behavioral Vectors</span>
          </div>

          <div className="mt-4 space-y-3">
            {DEMOGRAPHIC_PROFESSIONS.map((p) => (
              <div key={p.cluster} className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{p.cluster}</span>
                  <span className="font-mono font-bold text-purple-300">{p.percentage}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${p.percentage * 2.5}%` }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Semantic Vector Confidence: {Math.round(p.confidence * 100)}%</span>
                  <span>Cluster Size: ~{(p.percentage * 870).toLocaleString()} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
