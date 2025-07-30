// 📁 server/routes/interactions.js

import express from "express";
import Interaction from "../models/Interaction.js";

const router = express.Router();

// ✅ GET interaction stats for multiple postIds
router.post("/stats", async (req, res) => {
  const { postIds } = req.body;
  console.log('[STATS] Fetching stats for postIds:', postIds);

  try {
    const stats = await Interaction.find({ postId: { $in: postIds } });

    const statsMap = {};
    stats.forEach((stat) => {
      statsMap[stat.postId] = { likes: stat.likes, views: stat.views };
    });
    console.log('[STATS] Stats found:', statsMap);
    res.json(statsMap);
  } catch (err) {
    console.error('[STATS] Failed to fetch stats:', err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ✅ POST: increase like
router.post("/like/:postId", async (req, res) => {
  const { postId } = req.params;
  console.log('[LIKE] Received like request for postId:', postId);
  try {
    const interaction = await Interaction.findOneAndUpdate(
      { postId },
      { $inc: { likes: 1 } },
      { new: true, upsert: true }
    );
    console.log('[LIKE] Updated interaction:', interaction);
    res.json({ likes: interaction.likes });
  } catch (err) {
    console.error('[LIKE] Failed to like post:', err);
    res.status(500).json({ error: "Failed to like post" });
  }
});

// ✅ POST: increase view
router.post("/view/:postId", async (req, res) => {
  const { postId } = req.params;
  console.log('[VIEW] Received view request for postId:', postId);
  try {
    const interaction = await Interaction.findOneAndUpdate(
      { postId },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );
    console.log('[VIEW] Updated interaction:', interaction);
    res.json({ views: interaction.views });
  } catch (err) {
    console.error('[VIEW] Failed to increase view:', err);
    res.status(500).json({ error: "Failed to increase view" });
  }
});


export default router;
