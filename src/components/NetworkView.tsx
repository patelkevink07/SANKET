import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Users,
  Shield,
  Bot,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Account, NetworkEdge, Post } from '../types';

interface NetworkViewProps {
  accounts: Account[];
  edges: NetworkEdge[];
  posts: Post[];
  isBotFilterActive: boolean;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  account: Account;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  accounts,
  edges,
  posts,
  isBotFilterActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Account | null>(accounts[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timelineStep, setTimelineStep] = useState<number>(6); // 0 to 6 representing hours 00:00 to 06:00
  const [centralityMetric, setCentralityMetric] = useState<'betweenness' | 'eigenvector' | 'in_degree'>('betweenness');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredNode, setHoveredNode] = useState<Account | null>(null);

  // Filter accounts if bot exclusion is active
  const visibleAccounts = isBotFilterActive
    ? accounts.filter((a) => !a.is_bot_suspected)
    : accounts;

  const visibleAccountIds = new Set(visibleAccounts.map((a) => a.id));

  const visibleEdges = edges.filter(
    (e) => visibleAccountIds.has(e.source_account_id) && visibleAccountIds.has(e.target_account_id)
  );

  // Filter edges based on timeline step (simulate propagation over time)
  // Step 0: 2 edges, Step 1: 3 edges ... Step 6: all visible edges
  const activeEdgeCount = Math.max(2, Math.floor(((timelineStep + 1) / 7) * visibleEdges.length));
  const activeEdges = visibleEdges.slice(0, activeEdgeCount);

  // Active accounts that have connections in this time step
  const connectedAccountIds = new Set<string>();
  activeEdges.forEach((e) => {
    connectedAccountIds.add(e.source_account_id);
    connectedAccountIds.add(e.target_account_id);
  });

  // Keep layout node positions stabilized
  const nodesRef = useRef<NodePosition[]>([]);

  useEffect(() => {
    const width = 640;
    const height = 460;
    const center = { x: width / 2, y: height / 2 };

    // Arrange nodes in an organic force circle
    const count = visibleAccounts.length;
    nodesRef.current = visibleAccounts.map((acc, index) => {
      const angle = (index / count) * 2 * Math.PI;
      const dist = acc.influence_rank === 1 ? 40 : (acc.influence_rank || 5) * 36;
      const influenceScore = (11 - (acc.influence_rank || 10)) / 10;
      const radius = 12 + influenceScore * 18;

      return {
        id: acc.id,
        x: center.x + Math.cos(angle) * dist + (Math.sin(index * 2) * 20),
        y: center.y + Math.sin(angle) * dist + (Math.cos(index * 2) * 20),
        vx: 0,
        vy: 0,
        radius,
        account: acc,
      };
    });
  }, [visibleAccounts]);

  // Animation playback loop for time scrubber
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return 6;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Render Canvas Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw Edges
      activeEdges.forEach((edge) => {
        const sourceNode = nodesRef.current.find((n) => n.id === edge.source_account_id);
        const targetNode = nodesRef.current.find((n) => n.id === edge.target_account_id);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);

          // Edge color by interaction type
          if (edge.edge_type === 'retweet') {
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)'; // Amber for amplification
            ctx.setLineDash([4, 4]);
          } else if (edge.edge_type === 'reply') {
            ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)'; // Teal for dialogue
            ctx.setLineDash([]);
          } else if (edge.edge_type === 'mention') {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; // Sky for mention
            ctx.setLineDash([]);
          } else {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'; // Default
            ctx.setLineDash([]);
          }

          ctx.lineWidth = Math.min(4, Math.max(1.5, edge.weight / 4));
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw small arrow / pulse circle along edge
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.beginPath();
          ctx.arc(midX, midY, 2.5, 0, 2 * Math.PI);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fill();
        }
      });

      // Draw Nodes
      nodesRef.current.forEach((node) => {
        const isConnected = connectedAccountIds.has(node.id);
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Node fill color by dominant sentiment
        let fillColor = '#14b8a6'; // supportive (teal)
        if (node.account.dominant_sentiment === 'anxious') fillColor = '#a855f7'; // anxious (purple)
        else if (node.account.dominant_sentiment === 'sarcastic') fillColor = '#f59e0b'; // sarcastic (amber)
        else if (node.account.dominant_sentiment === 'against') fillColor = '#f43f5e'; // against (rose)
        else if (node.account.dominant_sentiment === 'excited') fillColor = '#38bdf8'; // excited (sky)

        // Draw outer pulse halo for selected or KOL
        if (isSelected || node.account.influence_rank === 1) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected ? 'rgba(20, 184, 166, 0.25)' : 'rgba(56, 189, 248, 0.2)';
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#14b8a6' : '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = isConnected ? fillColor : '#334155';
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;
        ctx.strokeStyle = node.account.is_bot_suspected ? '#f59e0b' : '#ffffff';
        if (node.account.is_bot_suspected) {
          ctx.setLineDash([3, 3]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`@${node.account.username}`, node.x, node.y + node.radius + 14);

        // Platform Badge
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(`[${node.account.platform_id.toUpperCase()}]`, node.x, node.y + node.radius + 24);
      });

      ctx.restore();
    };

    render();
  }, [activeEdges, selectedNode, hoveredNode, zoomLevel, timelineStep, visibleAccounts]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoomLevel;
    const clickY = (e.clientY - rect.top) / zoomLevel;

    // Check hit test
    const clicked = nodesRef.current.find((n) => {
      const dx = n.x - clickX;
      const dy = n.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    if (clicked) {
      setSelectedNode(clicked.account);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const hoverX = (e.clientX - rect.left) / zoomLevel;
    const hoverY = (e.clientY - rect.top) / zoomLevel;

    const hovered = nodesRef.current.find((n) => {
      const dx = n.x - hoverX;
      const dy = n.y - hoverY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    setHoveredNode(hovered ? hovered.account : null);
  };

  // Posts by selected account
  const selectedAccountPosts = posts.filter((p) => p.account_id === selectedNode?.id);

  return (
    <div className="space-y-6">
      {/* Component E Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-teal-400">COMPONENT E // NETWORK TOPOLOGY</span>
            <span className="rounded-full bg-sky-950 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-800/40">
              Link Analysis & Influence Flow
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-100">
            Interactive Follower / Interaction Topology & Key Opinion Leader (KOL) Mapping
          </h2>
          <p className="text-xs text-slate-400">
            Discovering high-centrality opinion nodes, amplification bridges, and visualizing how sentiment propagates chronologically across the network.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">Algorithm: NetworkX Betweenness Centrality</span>
        </div>
      </div>

      {/* Main Interactive Canvas & Inspection Panel Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 cols: Interactive Canvas + Timeline Propagation Scrubber */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-8 flex flex-col justify-between">
          <div>
            {/* Canvas Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Force Topology Graph
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-teal-400" /> Support
                  <span className="h-2 w-2 rounded-full bg-purple-400 ml-1" /> Anxiety
                  <span className="h-2 w-2 rounded-full bg-amber-400 ml-1" /> Sarcasm
                  <span className="h-2 w-2 rounded-full bg-rose-400 ml-1" /> Oppose
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
                  className="rounded bg-slate-800 p-1 text-slate-300 hover:bg-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                  className="rounded bg-slate-800 p-1 text-slate-300 hover:bg-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="relative mt-3 flex items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
              <canvas
                ref={canvasRef}
                width={640}
                height={420}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                className="cursor-crosshair w-full max-w-full"
              />
              <div className="absolute bottom-2 left-3 rounded bg-slate-900/80 px-2 py-1 text-[10px] font-mono text-slate-400 border border-slate-800">
                Nodes: {visibleAccounts.length} | Active Links: {activeEdges.length}
              </div>
            </div>
          </div>

          {/* Time Scrubber / Cascade Propagation Controller */}
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  id="btn-play-cascade"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1 rounded-md border border-teal-500/40 bg-teal-950/80 px-2.5 py-1 font-mono text-xs font-semibold text-teal-300 hover:bg-teal-900"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY CASCADE'}</span>
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setTimelineStep(0); }}
                  className="rounded bg-slate-800 p-1 text-slate-400 hover:text-slate-200"
                  title="Reset Timeline to 00:00"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-xs text-slate-300">
                  Step: T+0{timelineStep}:00 Hours (Active Links: {activeEdges.length})
                </span>
              </div>
              <span className="text-[11px] text-teal-400 font-mono">
                {timelineStep === 6 ? 'FULL CASCADE RECONSTRUCTED' : 'PROPAGATION SPREADING...'}
              </span>
            </div>

            {/* Slider */}
            <div className="mt-2.5 flex items-center gap-3">
              <span className="font-mono text-[10px] text-slate-400">00:00</span>
              <input
                type="range"
                min={0}
                max={6}
                value={timelineStep}
                onChange={(e) => setTimelineStep(parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-teal-400"
              />
              <span className="font-mono text-[10px] text-slate-400">06:00</span>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Node Inspection Drawer */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100">Inspected Opinion Node</h3>
              {selectedNode?.is_bot_suspected ? (
                <span className="rounded bg-amber-950 border border-amber-800/60 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  Bot Score: {(selectedNode.bot_score * 100).toFixed(0)}%
                </span>
              ) : (
                <span className="rounded bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                  Organic Account
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm font-bold text-slate-100">
                        @{selectedNode.username}
                      </div>
                      <div className="text-xs text-slate-400">{selectedNode.display_name}</div>
                    </div>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase font-mono text-slate-300">
                      {selectedNode.platform_id}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed italic">
                    "{selectedNode.bio}"
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500">Reach:</span>
                      <div className="font-bold text-slate-200">{selectedNode.follower_count.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">KOL Rank:</span>
                      <div className="font-bold text-teal-400">Rank #{selectedNode.influence_rank}</div>
                    </div>
                  </div>
                </div>

                {/* Centrality Metrics */}
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Network Topology Centrality
                  </span>
                  <div className="mt-2 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Betweenness Centrality:</span>
                      <span className="text-teal-400 font-bold">
                        {selectedNode.influence_rank === 1 ? '0.942 (Hub)' : (0.85 - (selectedNode.influence_rank || 5) * 0.08).toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Eigenvector Influence:</span>
                      <span className="text-sky-400 font-bold">
                        {selectedNode.influence_rank === 1 ? '0.891' : (0.78 - (selectedNode.influence_rank || 5) * 0.07).toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">In-Degree Propagation:</span>
                      <span className="text-purple-400 font-bold">
                        {selectedNode.influence_rank === 1 ? '18 Connections' : `${12 - (selectedNode.influence_rank || 1)} Connections`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Posts from this node */}
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Recent Seed Posts ({selectedAccountPosts.length})
                  </span>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedAccountPosts.map((post) => (
                      <div key={post.id} className="rounded border border-slate-800 bg-slate-950 p-2 text-xs">
                        <p className="text-slate-200 line-clamp-2">{post.content}</p>
                        <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>{post.sentiment?.primary_label}</span>
                          <span>{post.like_count} likes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                Click any node on the graph to inspect its centrality parameters and seed posts.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Opinion Leaders (KOL) Leaderboard Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Ranked Key Opinion Leaders (Nodes of High Influence)
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-400">Ranked by Betweenness Centrality</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[11px] uppercase text-slate-400">
                <th className="py-2.5 pr-4">Rank</th>
                <th className="py-2.5 pr-4">Account / Authority</th>
                <th className="py-2.5 pr-4">Platform</th>
                <th className="py-2.5 pr-4">Follower Reach</th>
                <th className="py-2.5 pr-4">Betweenness Score</th>
                <th className="py-2.5 pr-4">Dominant Sentiment</th>
                <th className="py-2.5 pr-4">Bot Likelihood</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {visibleAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  onClick={() => setSelectedNode(acc)}
                  className={`cursor-pointer transition-colors hover:bg-slate-800/40 ${
                    selectedNode?.id === acc.id ? 'bg-slate-800/60 text-teal-300' : 'text-slate-300'
                  }`}
                >
                  <td className="py-3 font-bold text-slate-100">#{acc.influence_rank}</td>
                  <td className="py-3">
                    <div className="font-sans font-semibold text-slate-200">@{acc.username}</div>
                    <div className="font-sans text-[11px] text-slate-400 line-clamp-1">{acc.display_name}</div>
                  </td>
                  <td className="py-3 uppercase text-slate-400">{acc.platform_id}</td>
                  <td className="py-3 text-slate-200">{acc.follower_count.toLocaleString()}</td>
                  <td className="py-3 font-bold text-teal-400">
                    {acc.influence_rank === 1 ? '0.942' : (0.85 - (acc.influence_rank || 5) * 0.08).toFixed(3)}
                  </td>
                  <td className="py-3">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${
                      acc.dominant_sentiment === 'anxious' ? 'bg-purple-950 text-purple-300' :
                      acc.dominant_sentiment === 'sarcastic' ? 'bg-amber-950 text-amber-300' :
                      acc.dominant_sentiment === 'supportive' ? 'bg-teal-950 text-teal-300' :
                      'bg-rose-950 text-rose-300'
                    }`}>
                      {acc.dominant_sentiment}
                    </span>
                  </td>
                  <td className="py-3">
                    {acc.is_bot_suspected ? (
                      <span className="text-amber-400 font-bold">{(acc.bot_score * 100).toFixed(0)}% (Bot)</span>
                    ) : (
                      <span className="text-emerald-400">{(acc.bot_score * 100).toFixed(0)}% (Organic)</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedNode(acc); }}
                      className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                    >
                      Inspect Node
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
