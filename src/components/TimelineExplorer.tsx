import React, { useState } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  Repeat,
  Heart,
  Share2,
  Code,
  Sparkles,
  Bot,
  AlertTriangle,
  CornerDownRight,
  ExternalLink,
} from 'lucide-react';
import { Post, PrimarySentiment } from '../types';

interface TimelineExplorerProps {
  posts: Post[];
  selectedTopic: string | null;
  onResetTopicFilter: () => void;
  onOpenLiveAiModal: () => void;
}

export const TimelineExplorer: React.FC<TimelineExplorerProps> = ({
  posts,
  selectedTopic,
  onResetTopicFilter,
  onOpenLiveAiModal,
}) => {
  const [activePostForJson, setActivePostForJson] = useState<Post | null>(null);
  const [sentimentFilter, setSentimentFilter] = useState<PrimarySentiment | 'all'>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = posts.filter((p) => {
    if (sentimentFilter !== 'all' && p.sentiment?.primary_label !== sentimentFilter) return false;
    if (languageFilter !== 'all' && p.language !== languageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = p.content.toLowerCase().includes(q);
      const matchAuthor = p.account?.username.toLowerCase().includes(q) || p.account?.display_name.toLowerCase().includes(q);
      const matchTopics = p.topics.some(t => t.toLowerCase().includes(q));
      if (!matchContent && !matchAuthor && !matchTopics) return false;
    }
    return true;
  });

  // Separate root posts from reply posts for threading display
  const rootPosts = filteredPosts.filter((p) => !p.parent_post_id);
  const replyPostsMap = new Map<string, Post[]>();
  filteredPosts.forEach((p) => {
    if (p.parent_post_id) {
      const existing = replyPostsMap.get(p.parent_post_id) || [];
      existing.push(p);
      replyPostsMap.set(p.parent_post_id, existing);
    }
  });

  return (
    <div className="space-y-6">
      {/* Component A Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-teal-400">COMPONENT A // CHRONOLOGICAL BACKBONE</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              Structured Timeline & Thread Reconstruction
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-100">
            Ground-Truth Historical Data Stream & Reply Chains
          </h2>
          <p className="text-xs text-slate-400">
            Inspect raw ingested posts, threaded conversational hierarchy, metadata JSONB payloads, and multi-lingual language flags.
          </p>
        </div>

        <button
          onClick={onOpenLiveAiModal}
          className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-950/60 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-900/60"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-400" />
          <span>Analyze Custom Post</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value as any)}
            aria-label="Filter by sentiment emotion"
            className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-slate-200 focus:border-teal-500 focus:outline-hidden"
          >
            <option value="all">All Sentiments</option>
            <option value="anxious">Anxious</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="against">Opposition</option>
            <option value="supportive">Supportive</option>
            <option value="excited">Excited</option>
          </select>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label="Filter by language code"
            className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-slate-200 focus:border-teal-500 focus:outline-hidden"
          >
            <option value="all">All Languages</option>
            <option value="hi-en">Hinglish (Code-Mixed)</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>

          {selectedTopic && (
            <div className="flex items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-950/60 px-2.5 py-1 text-xs text-indigo-300">
              <span>Topic: <strong>{selectedTopic}</strong></span>
              <button
                onClick={onResetTopicFilter}
                className="ml-1 text-indigo-400 hover:text-indigo-200 font-bold"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed text, author..."
              className="w-56 rounded-md border border-slate-800 bg-slate-950 py-1.5 pr-3 pl-8 text-xs text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-hidden"
            />
          </div>
          <span className="font-mono text-xs text-slate-400">
            {filteredPosts.length} posts
          </span>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {rootPosts.length > 0 ? (
          rootPosts.map((post) => {
            const replies = replyPostsMap.get(post.id) || [];
            const sent = post.sentiment;

            return (
              <div key={post.id} className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition-all">
                {/* Post Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 font-mono text-xs font-bold text-teal-400">
                      {post.account?.username?.slice(0, 2).toUpperCase() || 'US'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-200 text-xs sm:text-sm">
                          {post.account?.display_name || 'Observed Author'}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          @{post.account?.username}
                        </span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] uppercase font-mono text-slate-400">
                          {post.platform_id}
                        </span>
                        {post.account?.is_bot_suspected && (
                          <span className="flex items-center gap-0.5 rounded bg-amber-950 px-1.5 py-0.2 text-[10px] font-mono text-amber-300 border border-amber-800/40">
                            <Bot className="h-2.5 w-2.5" /> Bot Suspected ({(post.account.bot_score * 100).toFixed(0)}%)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {new Date(post.posted_at).toLocaleString()} • Ingested via Postgres Worker
                      </div>
                    </div>
                  </div>

                  {/* Sentiment and Emotion Badge */}
                  <div className="flex items-center gap-2">
                    {post.language === 'hi-en' && (
                      <span className="rounded bg-amber-950 border border-amber-800/50 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                        Hinglish
                      </span>
                    )}
                    {sent?.sarcasm_score && sent.sarcasm_score > 0.8 && (
                      <span className="rounded bg-amber-900/60 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                        🎭 Sarcasm ({Math.round(sent.sarcasm_score * 100)}%)
                      </span>
                    )}
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold uppercase ${
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

                {/* Post Content */}
                <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {post.content}
                </p>

                {/* Topics & Engagement Footer */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-2.5 text-xs text-slate-400">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.topics.map((tp) => (
                      <span key={tp} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-slate-800">
                        {tp}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 text-slate-500" />
                      {post.like_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat className="h-3.5 w-3.5 text-slate-500" />
                      {post.share_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                      {post.comment_count.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setActivePostForJson(post)}
                      className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-slate-300 hover:bg-slate-700"
                    >
                      <Code className="h-3 w-3 text-teal-400" />
                      <span>JSONB</span>
                    </button>
                  </div>
                </div>

                {/* Threaded Replies (Parent-Child Hierarchy) */}
                {replies.length > 0 && (
                  <div className="mt-3 border-l-2 border-slate-800 pl-4 space-y-3">
                    {replies.map((reply) => {
                      const replySent = reply.sentiment;
                      return (
                        <div key={reply.id} className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="h-3 w-3 text-slate-500" />
                              <span className="font-semibold text-slate-200">
                                {reply.account?.display_name}
                              </span>
                              <span className="font-mono text-[11px] text-slate-400">
                                @{reply.account?.username}
                              </span>
                            </div>
                            <span className={`rounded px-1.5 py-0.2 text-[10px] font-mono uppercase ${
                              replySent?.primary_label === 'anxious' ? 'bg-purple-950 text-purple-300' :
                              replySent?.primary_label === 'sarcastic' ? 'bg-amber-950 text-amber-300' :
                              replySent?.primary_label === 'supportive' ? 'bg-teal-950 text-teal-300' :
                              'bg-rose-950 text-rose-300'
                            }`}>
                              {replySent?.primary_label}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                            {reply.content}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                            <span>{new Date(reply.posted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <div className="flex items-center gap-3">
                              <span>{reply.like_count} likes</span>
                              <button
                                onClick={() => setActivePostForJson(reply)}
                                className="text-teal-400 hover:underline"
                              >
                                View Raw
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-400">
            No posts match the active sentiment, language, or search query.
          </div>
        )}
      </div>

      {/* Raw JSONB Modal */}
      {activePostForJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-teal-400" />
                <h3 className="text-sm font-semibold text-slate-100 font-mono">
                  PostgreSQL raw_json Payload // ID: {activePostForJson.id}
                </h3>
              </div>
              <button
                onClick={() => setActivePostForJson(null)}
                className="text-slate-400 hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto rounded-lg bg-slate-950 p-3.5 font-mono text-xs text-teal-300">
              <pre>{JSON.stringify(activePostForJson, null, 2)}</pre>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Schema Target: <code className="text-slate-300">public.posts.raw_metadata (JSONB)</code></span>
              <button
                onClick={() => setActivePostForJson(null)}
                className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
