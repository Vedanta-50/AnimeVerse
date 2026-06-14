import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse request bodies as JSON
app.use(express.json());

// Initialize Gemini Client
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (aiApiKey && aiApiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: aiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized GoogleGenAI client on the server.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY env variable is default, mock, or missing. Chatbot will run in fallback simulation mode.");
}

// System instructions for the Anime Assistant
const SYSTEM_INSTRUCTION = `You are the AnimeVerse AI Assistant, an elite, passionate, and deeply knowledgeable anime expert, critic, and database guide. 
Your goals:
1. Help users discover amazing anime from different eras (classic 90s, modern blockbusters, seasonal gems).
2. Recommend shows based on their mood, specific keywords, or preferred tropes (e.g., "warm slice-of-life", "dark fantasy with deep worldbuilding", "high-octane futuristic mecha").
3. Suggest hidden gems that aren't necessarily in the top 10 rankings but have exceptional writing, directing, or animation.
4. Give side-by-side comparisons of titles, answering character lore questions, and discussing animation studios (like MAPPA, Madhouse, ufotable, Kyoto Animation).
5. Explain anime-related terms happily (e.g., "Tsundere", "Sakuga", "Isekai", "Cour").

IMPORTANT rules:
- Format your responses in clean, structured Markdown, utilizing bullet points, bold emphasis, and code blocks blockquotes if needed to make them highly scannable and beautiful.
- Keep responses relatively concise but filled with specific details (years, creators, themes, studios).
- You MUST NOT recommend streaming or torrenting links or support unauthorized viewing channels.
- Emphasize character chemistry, visual themes, or sound production when analyzing recommendations.`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AnimeVerse Server is running smoothly." });
});

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message parameter is required." });
  }

  // Fallback answers database in case the API key is not configured or fails
  const animeFallbacks: any = {
    mood: "If you are looking for an immersive experience, I highly recommend **Sousou no Frieren (Frieren: Beyond Journey's End)**. It is a slow-burn masterpiece about what happens AFTER the hero's quest. If you want high action, **Jujutsu Kaisen Season 2** features mindblowing choreography and tragic lore. What genres do you usually enjoy?",
    recomm: "I highly recommend checking out some underappreciated hidden gems:\n- **Odd Taxi**: A brilliant noir mystery with sharp dialogue and a phenomenal twist.\n- **Keep Your Hands Off Eizouken!**: An incredible love letter to the core craft of hand-drawn animation.\n- **Mushishi**: A beautiful, episodic supernatural slice-of-life about living alongside primordial microscopic lifeforms.",
    shibuya: "The Shibuya Incident arc in **Jujutsu Kaisen Season 2** is a turning point where cursed spirits launch an assault on Tokyo. It features Satoru Gojo's sealing, intense character deaths, and incredible sound direction by MAPPA. It begins on Episode 6 of Season 2 (Episode 30 overall).",
    studio: "Some of the legendary studios include:\n- **ufotable**: Known for impeccable 3D digital effects integration and peak dynamic lighting (demonstrated in *Demon Slayer* or the *Fate/stay night* franchise).\n- **Kyoto Animation**: Known for stunning character expressions, exquisite background details, and unparalleled light reflection studies.\n- **Madhouse**: Historic giant responsible for classics like *Death Note*, *Hunter x Hunter (2011)*, and the newer *Sousou no Frieren*.",
    genres: "There are several main anime genres you should discover:\n1. **Shonen**: Aimed at young males but universally loved, focuses on action or personal growth (like *Jujutsu Kaisen*, *My Hero Academia*).\n2. **Seinen**: Aimed at older audiences, dealing with complex psychological or philosophical topics (*Vinland Saga*, *Monster*).\n3. **Slice of Life**: Captures daily warmth and quiet moments (*Yuru Camp*, *Barakamon*)."
  };

  const lowerMsg = message.toLowerCase();
  let selectedFallback = animeFallbacks.mood;
  if (lowerMsg.includes("recom") || lowerMsg.includes("gem") || lowerMsg.includes("suggest")) {
    selectedFallback = animeFallbacks.recomm;
  } else if (lowerMsg.includes("jujutsu") || lowerMsg.includes("shibuya") || lowerMsg.includes("gojo")) {
    selectedFallback = animeFallbacks.shibuya;
  } else if (lowerMsg.includes("studio") || lowerMsg.includes("mappa") || lowerMsg.includes("ufotable")) {
    selectedFallback = animeFallbacks.studio;
  } else if (lowerMsg.includes("genre") || lowerMsg.includes("type")) {
    selectedFallback = animeFallbacks.genres;
  }

  // If AI client is not initialized, return the fallback
  if (!ai) {
    // Artificial lag for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.json({
      text: `*(Virtual Assistant Mode)*\n\n${selectedFallback}\n\n*Note: Set up a valid GEMINI_API_KEY in the Secrets panel to activate full real-time reasoning responses.*`
    });
  }

  try {
    // Map history to Google GenAI format: user->user, assistant->model
    const formattedContents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        formattedContents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    // Append the current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text || "I was unable to formulate a response. Please try again." });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with the AI engine.",
      details: error.message,
      text: `*(Error Mode Failover)*\n\nI encountered a technical hurdle, but as an anime expert, let me share this:\n\n${selectedFallback}`
    });
  }
});

// Vite Setup or Static Files serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files server configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AnimeVerse server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
