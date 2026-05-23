import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
      }
    }
  }
  return ai;
}

// API endpoint for AI personalized recommendations
app.post("/api/ai/recommendations", async (req, res) => {
  const { genres, mood, preferences } = req.body;
  
  const client = getGeminiClient();
  if (!client) {
    // Graceful fallback with high-quality mock bookstore recommendation recommendations
    return res.json({
      fallback: true,
      recommendations: [
        {
          title: `Echoes of ${genres?.[0] || 'Adventure'}`,
          author: "Cassandra Vance",
          rating: 4.8,
          description: `A profound journey balancing elements of ${genres?.join(', ') || 'modern literature'}. Intentionally crafted for matching a ${mood || 'inspired'} mood.`,
          tags: [genres?.[0] || "Fiction", "Bestseller"]
        },
        {
          title: "The Silent Canopy",
          author: "Marcus Aurel",
          rating: 4.6,
          description: `An exquisite tapestry of thoughts surrounding the quiet of human connection, reflecting your preferences of "${preferences || 'no preferences specified'}".`,
          tags: ["Philosophy", "Self-Discovery"]
        }
      ]
    });
  }

  try {
    const prompt = `Recommend 3 highly realistic books based on the following choices:
- Preferred Genres: ${genres ? genres.join(", ") : "Any"}
- Current Reading Mood: ${mood || "Reflective and deep"}
- Additional User Preferences: ${preferences || "Surprise me with highly engaging reads"}

Response must be in JSON format matching this schema:
{
  "recommendations": [
    {
      "title": "string (Realistic interesting book title)",
      "author": "string (Author name)",
      "rating": number (between 4.0 and 5.0),
      "description": "string (Short teaser / 2-sentence description of the book)",
      "tags": ["string (2-3 genre tags)"]
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["recommendations"],
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "author", "rating", "description", "tags"],
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    console.error("Gemini Recommendations Error:", error);
    res.status(500).json({ error: "Failed to generate recommendations", details: String(error) });
  }
});

// API endpoint for AI book summary & themes
app.post("/api/ai/book-summarize", async (req, res) => {
  const { title, author } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Book title is required" });
  }

  const client = getGeminiClient();
  if (!client) {
    return res.json({
      fallback: true,
      summary: `This is a highly responsive summary for '${title}' by ${author || 'Unknown'}. This is a timeless masterpiece exploring complex interpersonal themes, social dynamics, and the pursuit of individual excellence in a changing world.`,
      themes: ["Human Condition", "Legacy and Ambition", "The Quest for Truth"],
      keyQuotes: [
        "In the middle of difficulty lies opportunity.",
        "To think is to be easy, to act is difficult; but to act according to one's thought is the most difficult thing in the world."
      ],
      quickReview: "A stunning contribution to literary history. Recommended for those wishing to dive into intellectual reflections."
    });
  }

  try {
    const prompt = `Provide an elegant structural analysis and dynamic review of the book "${title}"${author ? ` by ${author}` : ''}.
Return the analytical response in JSON format matching this schema:
{
  "summary": "string (A beautiful, elegant 3-sentence editorial summary of the plot or main argument)",
  "themes": ["string (3 key powerful themes)"],
  "keyQuotes": ["string (2 notable quotes)"],
  "quickReview": "string (A brief critics review assessing why it is worth reading today)"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "themes", "keyQuotes", "quickReview"],
          properties: {
            summary: { type: Type.STRING },
            themes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keyQuotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            quickReview: { type: Type.STRING }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    console.error("Gemini Summarize Error:", error);
    res.status(500).json({ error: "Failed to summarize the book", details: String(error) });
  }
});

// API endpoint to chat with a book character or author
app.post("/api/ai/chat-companion", async (req, res) => {
  const { bookTitle, characterName, userMessage, chatHistory } = req.body;
  if (!bookTitle || !characterName || !userMessage) {
    return res.status(400).json({ error: "Missing required properties" });
  }

  const client = getGeminiClient();
  if (!client) {
    const fallbackMessages: { [key: string]: string } = {
      default: `Greetings! I am ${characterName} from "${bookTitle}". Your thoughts are intriguing indeed. We walk through a world of shadows and light... tell me, what other questions stir your curiosity?`
    };
    return res.json({
      reply: fallbackMessages[characterName.toLowerCase()] || `Hello, friend. It is I, ${characterName} from '${bookTitle}'. I received your note: "${userMessage}". It reminds me of the journeys we shared. Let us discuss more!`,
      fallback: true
    });
  }

  try {
    const historyString = chatHistory && chatHistory.length > 0 
      ? chatHistory.map((h: any) => `${h.sender === 'user' ? 'Visitor' : characterName}: ${h.text}`).join("\n")
      : "";

    const prompt = `You are playing the role of the fictional character ${characterName} from the book "${bookTitle}".
Stay fully in-character, using their mannerisms, speech patterns, and historical/contextual background as portrayed in the book.

Previous Dialogue history:
${historyString}

Visitor's incoming message:
"${userMessage}"

Respond in-character immediately. Keep the response compact (2-3 sentences max) and highly engaging, encouraging deep reading.
Do not break character. Do not say you are an AI.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ reply: response.text || "I remain brief and quiet, as my pages convey." });
  } catch (error) {
    console.error("Gemini Character Chat Error:", error);
    res.status(500).json({ error: "Failed to chat with character", details: String(error) });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Vite middleware / static files routing
async function initViteMiddleware() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in Development mode");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static assets in Production mode");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BookVerse Server running at http://0.0.0.0:${PORT}`);
  });
}

initViteMiddleware().catch((err) => {
  console.error("Failed to start BookVerse Server:", err);
});
