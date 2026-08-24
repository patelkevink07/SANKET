import React, { useState } from 'react';
import { Header } from './components/Header';
import { CommandDashboard } from './components/CommandDashboard';
import { SentimentView } from './components/SentimentView';
import { DemographicsView } from './components/DemographicsView';
import { TrendsView } from './components/TrendsView';
import { NetworkView } from './components/NetworkView';
import { TimelineExplorer } from './components/TimelineExplorer';
import { IngestionOpsView } from './components/IngestionOpsView';
import { LiveAiModal } from './components/LiveAiModal';
import { AiBriefModal } from './components/AiBriefModal';
import {
  MOCK_ACCOUNTS,
  MOCK_EDGES,
  MOCK_INGESTION_JOBS,
  MOCK_POSTS,
  MOCK_TOPICS,
  MOCK_TRENDS,
} from './data/mockData';
import { FilterState, IngestionJob, PlatformType, Post } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [edges, setEdges] = useState(MOCK_EDGES);
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [topics, setTopics] = useState(MOCK_TOPICS);
  const [jobs, setJobs] = useState<IngestionJob[]>(MOCK_INGESTION_JOBS);
  const [isLiveAiModalOpen, setIsLiveAiModalOpen] = useState<boolean>(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState<boolean>(false);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    platforms: ['x', 'telegram', 'reddit', 'youtube', 'instagram', 'facebook'],
    timeWindow: '6h',
    searchQuery: '',
    excludeBots: false,
    selectedTopic: null,
  });

  // Filter posts based on global filters
  const filteredPosts = posts.filter((post) => {
    // Platform filter
    if (!filters.platforms.includes(post.platform_id)) {
      return false;
    }
    // Bot exclusion filter
    if (filters.excludeBots && post.account?.is_bot_suspected) {
      return false;
    }
    // Topic filter
    if (
      filters.selectedTopic &&
      !post.topics.some(
        (t) =>
          t.toLowerCase().includes(filters.selectedTopic!.toLowerCase().replace('#', '')) ||
          filters.selectedTopic!.toLowerCase().includes(t.toLowerCase().replace('#', ''))
      )
    ) {
      return false;
    }
    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor =
        post.account?.username.toLowerCase().includes(q) ||
        post.account?.display_name.toLowerCase().includes(q);
      const matchTopics = post.topics.some((t) => t.toLowerCase().includes(q));
      if (!matchContent && !matchAuthor && !matchTopics) {
        return false;
      }
    }
    return true;
  });

  // Filter accounts based on bot filter
  const filteredAccounts = filters.excludeBots
    ? accounts.filter((a) => !a.is_bot_suspected)
    : accounts;

  // Handle manual ingestion trigger
  const handleTriggerIngestion = (platform: PlatformType) => {
    setIsIngesting(true);
    setTimeout(() => {
      // Create a fresh simulated ingested post
      const newPost: Post = {
        id: `post-live-${Date.now()}`,
        platform_id: platform,
        platform_post_id: `live_${platform}_${Date.now()}`,
        account_id: 'acc_01',
        post_type: 'post',
        content: `[LIVE INGESTION SYNC] New update on ${platform.toUpperCase()}: Technical symposium releases comparative telemetry regarding hardware crypto standards.`,
        posted_at: new Date().toISOString(),
        ingested_at: new Date().toISOString(),
        like_count: Math.floor(Math.random() * 200) + 10,
        share_count: Math.floor(Math.random() * 50) + 5,
        comment_count: Math.floor(Math.random() * 30) + 2,
        is_deleted: false,
        language: 'en',
        topics: ['#TelecomSecurityBill', '#QuantumCrypto'],
        account: accounts[0],
        raw_metadata: { live_stream: true, source: 'worker_daemon' },
        sentiment: {
          id: `sent-live-${Date.now()}`,
          post_id: `post-live-${Date.now()}`,
          primary_label: 'supportive',
          polarity_score: 0.85,
          confidence: 0.94,
          sarcasm_score: 0.04,
          anxiety_score: 0.12,
          excitement_score: 0.78,
          support_score: 0.92,
          opposition_score: 0.06,
          model_version: 'hf-roberta-multi-emotion-v2.1',
          analyzed_at: new Date().toISOString(),
        },
      };

      setPosts((prev) => [newPost, ...prev]);

      // Update the ingestion job status
      setJobs((prev) =>
        prev.map((j) =>
          j.platform_id === platform
            ? {
                ...j,
                status: 'succeeded',
                records_ingested: j.records_ingested + 45,
                last_polled_at: new Date().toISOString(),
              }
            : j
        )
      );

      setIsIngesting(false);
    }, 1200);
  };

  const handleSelectTopic = (topic: string) => {
    setFilters((prev) => ({ ...prev, selectedTopic: topic }));
    setActiveTab('trends');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      {/* Tactical Header & Global Filters */}
      <Header
        filters={filters}
        onFilterChange={setFilters}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLiveAiModal={() => setIsLiveAiModalOpen(true)}
        onOpenBriefModal={() => setIsBriefModalOpen(true)}
        postCount={filteredPosts.length}
      />

      {/* Main Analytical View Area */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {activeTab === 'command' && (
            <CommandDashboard
              posts={filteredPosts}
              accounts={filteredAccounts}
              trends={trends}
              topics={topics}
              onSelectTab={setActiveTab}
              onSelectTopic={handleSelectTopic}
              isBotFilterActive={filters.excludeBots}
            />
          )}

          {activeTab === 'sentiment' && (
            <SentimentView
              posts={filteredPosts}
              onOpenLiveAiModal={() => setIsLiveAiModalOpen(true)}
            />
          )}

          {activeTab === 'demographics' && <DemographicsView />}

          {activeTab === 'trends' && (
            <TrendsView
              trends={trends}
              topics={topics}
              posts={filteredPosts}
              selectedTopic={filters.selectedTopic}
              onSelectTopic={(t) => setFilters((prev) => ({ ...prev, selectedTopic: t }))}
              onNavigateToTimeline={() => setActiveTab('timeline')}
            />
          )}

          {activeTab === 'network' && (
            <NetworkView
              accounts={filteredAccounts}
              edges={edges}
              posts={filteredPosts}
              isBotFilterActive={filters.excludeBots}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineExplorer
              posts={filteredPosts}
              selectedTopic={filters.selectedTopic}
              onResetTopicFilter={() => setFilters((prev) => ({ ...prev, selectedTopic: null }))}
              onOpenLiveAiModal={() => setIsLiveAiModalOpen(true)}
            />
          )}

          {activeTab === 'ops' && (
            <IngestionOpsView
              jobs={jobs}
              onTriggerIngestion={handleTriggerIngestion}
              isIngesting={isIngesting}
            />
          )}
        </div>
      </main>

      {/* Footer Status Strip */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-3 sm:px-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono">SIH 2026 NTRO SPECIFICATION // PROBLEM ID: 26152</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Database: PostgreSQL 16 (Unified JSONB + Link Topology) • Model: Gemini 2.5 Flash + RoBERTa Multi-Task
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LiveAiModal
        isOpen={isLiveAiModalOpen}
        onClose={() => setIsLiveAiModalOpen(false)}
      />

      <AiBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        posts={posts}
        accounts={accounts}
        trends={trends}
        topics={topics}
      />
    </div>
  );
}
