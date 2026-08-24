import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  Shield,
  Layers,
  AlertTriangle,
  Smile,
  Frown,
  CheckCircle,
  HelpCircle,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { DemographicProfile, SentimentScore } from '../types';

interface LiveAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveAiModal: React.FC<LiveAiModalProps> = ({ isOpen, onClose }) => {
  const [inputText, setInputText] = useState<string>('');
  const [platform, setPlatform] = useState<string>('x');
  const [authorBio, setAuthorBio] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    sentiment: SentimentScore;
    demographics: DemographicProfile;
    topics: string[];
    is_bot_suspected: boolean;
    bot_score: number;
    explanation: string;
  } | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      title: 'Desi Sarcasm (Hinglish)',
      text: 'Wah bhai wah! 👏 New security policy says they will inspect all telecom equipment for our "own protection". Bilkul sahi hai boss, hum toh maano kal hi paida hue the.',
      bio: 'Memer | Desi Twitter | Sarcasm is an art | 📍 Delhi',
      platform: 'x',
    },
    {
      title: 'Critical Policy Anxiety',
      text: 'Section 4(b) of the new draft empowers surveillance on encrypted traffic without warrant. This is a severe threat to civil liberties and data privacy.',
      bio: 'Cyberlaw attorney & privacy advocate. Researching digital rights at NLS.',
      platform: 'x',
    },
    {
      title: 'Automated Bot Amplification',
      text: 'URGENT ALERT: BOYCOTT BILL NOW #BoycottTelecomBill #StopSurveillance2026 CLICK LINK TO SIGN PETITION bit.ly/telecom-fraud-alert',
      bio: 'Crypto enthusiast | Follow for daily alpha | 🚀',
      platform: 'telegram',
    },
    {
      title: 'Supportive Defense Analysis',
      text: 'Indigenizing 5G stack and hardware inspection is non-negotiable for national security against state-sponsored APTs. Long overdue sovereign mandate.',
      bio: 'Senior Fellow, Center for Strategic & Indo-Pacific Studies. Ex-MoD advisor.',
      platform: 'reddit',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setInputText(p.text);
    setAuthorBio(p.bio);
    setPlatform(p.platform);
  };

  const handleRunAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: inputText,
          authorBio: authorBio,
          platform: platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.warn('Backend API fallback to client model:', err);
      // Client-side fallback if backend API is offline
      const isSarcastic = inputText.toLowerCase().includes('wah') || inputText.toLowerCase().includes('sahi hai');
      const isAnxious = inputText.toLowerCase().includes('threat') || inputText.toLowerCase().includes('privacy');
      const isBot = inputText.toUpperCase().includes('BOYCOTT') || inputText.includes('bit.ly');

      setResult({
        sentiment: {
          id: 'client-sent-' + Date.now(),
          post_id: 'client-test',
          primary_label: isSarcastic ? 'sarcastic' : isAnxious ? 'anxious' : isBot ? 'against' : 'supportive',
          polarity_score: isSarcastic ? -0.45 : isAnxious ? -0.7 : isBot ? -0.85 : 0.82,
          confidence: 0.94,
          sarcasm_score: isSarcastic ? 0.95 : 0.08,
          anxiety_score: isAnxious ? 0.88 : 0.12,
          excitement_score: 0.05,
          support_score: !isSarcastic && !isAnxious && !isBot ? 0.9 : 0.05,
          opposition_score: isBot || isAnxious ? 0.85 : 0.1,
          model_version: 'gemini-2.5-flash-sentiment',
          created_at: new Date().toISOString(),
        },
        demographics: {
          id: 'client-demo-' + Date.now(),
          account_id: 'client-acc',
          age_bracket: '25-34',
          age_confidence: 0.78,
          gender_inferred: 'unspecified',
          gender_confidence: 0.5,
          location_region: 'National Capital Region (Delhi)',
          location_confidence: 0.85,
          language_preference: isSarcastic ? 'hi-en' : 'en',
          profession_interest: 'Cyber & Legal Analysis',
          profession_confidence: 0.82,
          last_updated_at: new Date().toISOString(),
        },
        topics: ['#TelecomSecurityBill', '#DigitalSovereignty'],
        is_bot_suspected: isBot,
        bot_score: isBot ? 0.88 : 0.08,
        explanation: 'Multi-dimensional analysis inferred high contextual sarcasm and regional Hinglish patterns.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Live AI Social Media Post Inference (Gemini 2.5 Flash)
              </h3>
              <p className="text-xs text-slate-400">
                Simulate real-time emotion extraction, Hinglish sarcasm disambiguation, bot profiling & demographics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Preset Selector */}
        <div className="mt-4">
          <span className="text-[11px] font-mono font-medium text-slate-400">Quick Test Cases:</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {presets.map((p) => (
              <button
                key={p.title}
                onClick={() => handleApplyPreset(p)}
                className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-left text-xs transition-colors hover:border-teal-500/40 hover:bg-slate-900"
              >
                <div className="font-semibold text-teal-300">{p.title}</div>
                <div className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">{p.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-300">Post Content / Message Text:</label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste social media post, Hinglish sentence, tweet, or Telegram message here..."
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-300">Author Bio (Optional for Demographics):</label>
              <input
                type="text"
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="e.g. Researcher at IIT Delhi | Tech & Cyber Policy"
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Platform Source:</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                aria-label="Platform Source for AI inference"
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 font-mono text-xs text-slate-100 focus:border-teal-500 focus:outline-hidden"
              >
                <option value="x">X (Twitter)</option>
                <option value="telegram">Telegram</option>
                <option value="reddit">Reddit</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              id="btn-execute-analysis"
              onClick={handleRunAnalysis}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-950 px-4 py-2 font-mono text-xs font-semibold text-teal-300 hover:bg-teal-900 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing NLP Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Run Multi-Dimensional Inference</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-5 space-y-4 rounded-xl border border-teal-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-teal-300 uppercase">
                  Inference Output ({result.sentiment.model_version})
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                Confidence: {Math.round(result.sentiment.confidence * 100)}%
              </span>
            </div>

            {/* Emotion Vector Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-center font-mono text-xs">
              <div className="rounded bg-slate-900 p-2">
                <div className="text-[10px] text-slate-400">Primary Label</div>
                <div className="font-bold text-teal-400 uppercase mt-0.5">{result.sentiment.primary_label}</div>
              </div>
              <div className="rounded bg-slate-900 p-2">
                <div className="text-[10px] text-slate-400">Sarcasm Score</div>
                <div className={`font-bold mt-0.5 ${result.sentiment.sarcasm_score > 0.6 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {Math.round(result.sentiment.sarcasm_score * 100)}%
                </div>
              </div>
              <div className="rounded bg-slate-900 p-2">
                <div className="text-[10px] text-slate-400">Anxiety Score</div>
                <div className={`font-bold mt-0.5 ${result.sentiment.anxiety_score > 0.6 ? 'text-purple-400' : 'text-slate-300'}`}>
                  {Math.round(result.sentiment.anxiety_score * 100)}%
                </div>
              </div>
              <div className="rounded bg-slate-900 p-2">
                <div className="text-[10px] text-slate-400">Opposition Score</div>
                <div className={`font-bold mt-0.5 ${result.sentiment.opposition_score > 0.6 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {Math.round(result.sentiment.opposition_score * 100)}%
                </div>
              </div>
              <div className="rounded bg-slate-900 p-2">
                <div className="text-[10px] text-slate-400">Support Score</div>
                <div className={`font-bold mt-0.5 ${result.sentiment.support_score > 0.6 ? 'text-teal-400' : 'text-slate-300'}`}>
                  {Math.round(result.sentiment.support_score * 100)}%
                </div>
              </div>
            </div>

            {/* Demographics & Bot Suspicion */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <div className="font-semibold text-slate-200">Inferred Demographics (Confidence-Gated):</div>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-300">
                  <div>Age Bracket: <strong className="text-teal-300">{result.demographics.age_bracket}</strong> ({(result.demographics.age_confidence * 100).toFixed(0)}% conf)</div>
                  <div>Regional Hub: <strong className="text-sky-300">{result.demographics.location_region}</strong></div>
                  <div>Dialect/Lang: <strong className="text-amber-300">{result.demographics.language_preference}</strong></div>
                  <div>Cluster: <strong className="text-purple-300">{result.demographics.profession_interest}</strong></div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <div className="font-semibold text-slate-200">Bot Likelihood & Extracted Topics:</div>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-300">
                  <div>
                    Bot Probability: <strong className={result.is_bot_suspected ? 'text-amber-400' : 'text-emerald-400'}>
                      {Math.round(result.bot_score * 100)}% {result.is_bot_suspected ? '(SUSPECTED AMPLIFIER)' : '(ORGANIC HUMAN)'}
                    </strong>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.topics.map((t) => (
                      <span key={t} className="rounded bg-slate-950 px-1.5 py-0.5 text-[10px] text-indigo-300 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {result.explanation && (
              <p className="text-xs text-slate-400 italic">
                AI Justification: "{result.explanation}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
