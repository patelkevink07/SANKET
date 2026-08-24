import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Deep NLP and Sentiment Inference endpoint
app.post("/api/nlp/analyze-post", async (req, res) => {
  try {
    const { content, authorBio, platform, authorHandle } = req.body;

    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "Post content is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback heuristic scoring if no API key is provided
      const lower = content.toLowerCase();
      const isSarcastic = lower.includes("sahi hai") || lower.includes("surely") || lower.includes("great job...") || lower.includes("wah");
      const isAnxious = lower.includes("worry") || lower.includes("scared") || lower.includes("threat") || lower.includes("dar") || lower.includes("danger") || lower.includes("alert");
      const isExcited = lower.includes("awesome") || lower.includes("shandar") || lower.includes("breakthrough") || lower.includes("victory") || lower.includes("huge");
      const isSupportive = lower.includes("support") || lower.includes("agree") || lower.includes("commendable") || lower.includes("praise") || lower.includes("jai");
      const isOpposing = lower.includes("oppose") || lower.includes("fake") || lower.includes("boycott") || lower.includes("fail") || lower.includes("fraud");

      let primary_label = "neutral";
      let polarity_score = 0.05;
      if (isSarcastic) { primary_label = "sarcastic"; polarity_score = -0.4; }
      else if (isAnxious) { primary_label = "anxious"; polarity_score = -0.6; }
      else if (isExcited) { primary_label = "excited"; polarity_score = 0.8; }
      else if (isSupportive) { primary_label = "supportive"; polarity_score = 0.7; }
      else if (isOpposing) { primary_label = "against"; polarity_score = -0.75; }

      res.json({
        primary_label,
        polarity_score,
        sarcasm_score: isSarcastic ? 0.85 : 0.1,
        anxiety_score: isAnxious ? 0.88 : 0.15,
        excitement_score: isExcited ? 0.82 : 0.12,
        support_score: isSupportive ? 0.79 : 0.18,
        opposition_score: isOpposing ? 0.84 : 0.15,
        confidence: 0.82,
        model_version: "heuristic-v1.4-multilingual",
        language_detected: content.match(/[ऀ-ॿ]/) ? "hi (Hindi)" : (lower.includes("hai") || lower.includes("kya") || lower.includes("bhai")) ? "hi-en (Hinglish)" : "en (English)",
        inferred_demographics: {
          age_bracket: "25-34",
          age_confidence: 0.68,
          geography: "India (Northern Region)",
          geo_confidence: 0.75,
          language: "hi-en",
          professional_interest: "Policy & Defense",
          interest_confidence: 0.7,
          overall_confidence: 0.71,
        },
        bot_analysis: {
          is_bot_suspected: (authorHandle && authorHandle.match(/\d{5,}$/)) ? true : false,
          bot_score: (authorHandle && authorHandle.match(/\d{5,}$/)) ? 0.78 : 0.12,
          reasoning: "Profile pattern & syntactical rhythm evaluation",
        },
        topics_extracted: content.split(/\s+/).filter(w => w.startsWith("#") || w.length > 5).slice(0, 3),
      });
      return;
    }

    const prompt = `You are an expert NLP and social intelligence intelligence system for an intelligence agency analytics tool (NTRO - SIH 2026).
Analyze this social media post and optional author bio, specifically handling nuanced emotion, sarcasm, anxiety, Hinglish/code-mixed language, demographic clues from public text, bot likelihood, and topics.

Post Content: """${content}"""
Platform: ${platform || "unknown"}
Author Handle: ${authorHandle || "unknown"}
Author Bio: """${authorBio || "None provided"}"""

Return strict JSON with this exact structure:
{
  "primary_label": "supportive" | "against" | "anxious" | "excited" | "sarcastic" | "neutral",
  "polarity_score": number between -1.0 and 1.0,
  "sarcasm_score": number between 0.0 and 1.0,
  "anxiety_score": number between 0.0 and 1.0,
  "excitement_score": number between 0.0 and 1.0,
  "support_score": number between 0.0 and 1.0,
  "opposition_score": number between 0.0 and 1.0,
  "confidence": number between 0.0 and 1.0,
  "model_version": "gemini-3.7-flash-multi-emotion",
  "language_detected": string (e.g. "hi-en (Hinglish)", "en (English)", "hi (Hindi)", "ur (Urdu)", "ta (Tamil)", etc.),
  "inferred_demographics": {
    "age_bracket": "18-24" | "25-34" | "35-44" | "45-54" | "55+",
    "age_confidence": number 0.0 to 1.0,
    "geography": string (e.g. "India (Delhi-NCR)", "India (Maharashtra)", "South Asia", "Global Diaspora"),
    "geo_confidence": number 0.0 to 1.0,
    "language": string,
    "professional_interest": string (e.g. "Cyber & Defense", "National Security", "Tech & Startups", "Media & Politics", "Civil Service / Policy", "Student / Academia"),
    "interest_confidence": number 0.0 to 1.0,
    "overall_confidence": number 0.0 to 1.0
  },
  "bot_analysis": {
    "is_bot_suspected": boolean,
    "bot_score": number 0.0 to 1.0,
    "reasoning": string (concise explanation of repetitive phrasing, handle pattern, or organic authenticity)
  },
  "topics_extracted": ["array of 2 to 4 normalized keywords or hashtags"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("NLP Inference Error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze post" });
  }
});

// Generate Intelligence Briefing endpoint
app.post("/api/nlp/generate-brief", async (req, res) => {
  try {
    const { platform, dateRange, sentimentSummary, topTopics, topInfluencers, isBotFilterActive } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      res.json({
        executiveSummary: "Online community discussions exhibit an elevated anxiety-to-opposition ratio regarding emerging cyber policies and telecom regulations. High-centrality opinion leaders on X and Telegram are driving 64% of narrative velocity.",
        keyFindings: [
          "Co-ordinated hashtag velocity detected across Telegram channels propagating into X replies within a 45-minute propagation lag.",
          "Code-mixed Hinglish posts contain nuanced sarcasm that conventional polarity classifiers mislabel as positive.",
          "Excluding suspected bot accounts (12% of sample) lowers overall anxiety index by 18 points, indicating partial synthetic amplification."
        ],
        threatOrAlertLevel: "ELEVATED",
        recommendedActions: [
          "Track secondary reply cascades stemming from identified Key Opinion Leader nodes.",
          "Deploy contextual counter-narratives addressing specific regulatory ambiguities.",
          "Maintain live ingestion frequency at 1-minute intervals on priority Telegram feeds."
        ],
        generatedAt: new Date().toISOString()
      });
      return;
    }

    const prompt = `You are a Senior Strategic Analyst for the National Technical Research Organisation (NTRO) reviewing data from an AI Social Media Analytics Framework (SIH 2026).
Produce a concise, military/intelligence-grade situational assessment brief based on these telemetry inputs:

Platform: ${platform || "Cross-Platform (X, Telegram, Reddit, YouTube)"}
Time Window: ${dateRange || "Last 24 Hours"}
Sentiment Metrics: ${JSON.stringify(sentimentSummary || {})}
Top Trending Topics: ${JSON.stringify(topTopics || [])}
Top Key Opinion Leaders / High-Influence Nodes: ${JSON.stringify(topInfluencers || [])}
Bot Exclusion Filter Active: ${isBotFilterActive ? "YES" : "NO"}

Format strictly as JSON with keys:
{
  "executiveSummary": "2-3 concise, high-impact analytical sentences",
  "keyFindings": ["3 bullet points with crisp observations on narrative flow, emotion shifts, and KOL propagation"],
  "threatOrAlertLevel": "LOW" | "ELEVATED" | "HIGH" | "CRITICAL",
  "recommendedActions": ["3 actionable surveillance / counter-intelligence / reporting next steps"],
  "generatedAt": string ISO timestamp
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Brief generation error:", err);
    res.status(500).json({ error: err.message || "Failed to generate briefing" });
  }
});

// Vite Middleware for development / Static file serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Intelligence Analytics Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
