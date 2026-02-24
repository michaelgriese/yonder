const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from workspace root (index.html, src/, style.css, content/, etc.)
app.use(express.static(path.join(__dirname)));

// API: list files in content/posts
app.get('/api/posts', async (req, res) => {
  try {
    const postDir = path.join(__dirname, 'content', 'posts');
    const files = await fs.readdir(postDir);
    // optionally filter only .json
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    res.json(jsonFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening: http://localhost:${PORT}`);
});