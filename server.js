import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Allow n8n, Lovable, browsers to call this safely
app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ status: "rbxrun-proxy ok" });
});

// GET GAME PASSES FOR UNIVERSE
app.get("/passes", async (req, res) => {
  const universeId = req.query.universeId;

  if (!universeId) {
    return res.status(400).json({ error: "Missing universeId" });
  }

  try {
    const url = `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`;

    const r = await fetch(url);
    const text = await r.text();

    try {
      const json = JSON.parse(text);
      return res.json(json);
    } catch (e) {
      return res.status(502).json({
        error: "Roblox returned non-JSON",
        raw: text
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: "Server error fetching gamepasses",
      details: e.message
    });
  }
});

// START SERVER ON RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("rbxrun-proxy running on port " + PORT);
});