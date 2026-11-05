const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getNewReleases, searchTracks } = require("../controller/spotifyController");

// Optional auth: sets req.userId if a valid token is provided, but allows music playback regardless
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.id;
    } catch {
      // Allow through without rejecting
    }
  }
  next();
};

// Stream music data smoothly with or without token
router.get("/new-releases", optionalAuth, getNewReleases);
router.get("/search", optionalAuth, searchTracks);

module.exports = router;
