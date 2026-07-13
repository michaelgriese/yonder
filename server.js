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
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    // Read all JSON files in parallel and extract metadata
    const metas = await Promise.all(jsonFiles.map(async (filename) => {
      try {
        const filePath = path.join(postDir, filename);
        const content = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(content);
        return {
          name: filename,
          title: parsed.title || null,
          date: parsed.date || null,
          author: parsed.author || null
        };
      } catch (err) {
        console.error(`Error reading/parsing ${filename}:`, err);
        return { name: filename, title: null };
      }
    }));

    res.json(metas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening: http://localhost:${PORT}`);
});