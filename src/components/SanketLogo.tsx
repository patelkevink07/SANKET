import React from 'react';
import logoImage from '../assets/images/sanket_official_logo_1787580223321.jpg';

interface SanketLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  showSubtitle?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const SanketLogo: React.FC<SanketLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showTagline = false,
  className = '',
}) => {
  if (size === 'sm') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-teal-500/40 bg-slate-900 p-0.5 shadow-md shadow-teal-500/10">
          <img
            src={logoImage}
            alt="SANKET Official Intelligence Emblem"
            className="h-full w-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold tracking-wider text-slate-100">
              SANKET
            </span>
            <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] font-mono font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30">
              NTRO
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">
              Social Analytics & Network Knowledge Extraction
            </span>
          )}
        </div>
      </div>
    );
  }

  if (size === 'lg' || size === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Emblem */}
        <div className="relative flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center overflow-hidden rounded-2xl border border-slate-700/80 bg-white p-1.5 shadow-xl shadow-slate-950/50">
          <img
            src={logoImage}
            alt="SANKET Official Emblem"
            className="h-full w-full object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Wordmark */}
        <div className="mt-3 flex items-center gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-mono">
            SANKET
          </span>
        </div>

        {/* Tricolor Pipeline Divider */}
        <div className="my-2 flex items-center justify-center gap-1.5 w-48">
          <div className="h-[2px] flex-1 bg-amber-500 rounded-full" />
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ring-2 ring-slate-800" />
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
          <div className="h-[2px] flex-1 bg-emerald-500 rounded-full" />
        </div>

        {/* Full Expansion Name */}
        <h2 className="text-xs sm:text-sm font-semibold tracking-wide text-slate-300 max-w-md px-2">
          Social Analytics & Network Knowledge Extraction Technology
        </h2>

        {/* Strategic Mission Tagline */}
        {(showTagline || size === 'full') && (
          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono tracking-widest text-teal-400">
            <span className="h-px w-6 bg-teal-500/40" />
            <span>DECODE • ANALYZE • ANTICIPATE</span>
            <span className="h-px w-6 bg-teal-500/40" />
          </div>
        )}
      </div>
    );
  }

  // Default 'md'
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-teal-500/40 bg-white p-0.5 shadow-md shadow-teal-500/10">
        <img
          src={logoImage}
          alt="SANKET Official Intelligence Emblem"
          className="h-full w-full object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-extrabold tracking-wider text-slate-100">
            SANKET
          </span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-teal-400 bg-teal-950/60 border border-teal-500/40 rounded px-1.5 py-0.5">
            NTRO // SIH-26152
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            STREAM ACTIVE
          </span>
        </div>
        <h1 className="text-xs sm:text-sm font-medium text-slate-200">
          Social Analytics & Network Knowledge Extraction Technology
        </h1>
        {showTagline && (
          <div className="text-[10px] font-mono tracking-wider text-slate-400 mt-0.5">
            DECODE • ANALYZE • ANTICIPATE
          </div>
        )}
      </div>
    </div>
  );
};
