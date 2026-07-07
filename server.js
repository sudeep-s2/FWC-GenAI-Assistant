import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;

// Log startup details (safe logs only)
console.log(`Starting StadiumOS AI production server...`);
console.log(`Region targeted: asia-south1`);
console.log(`Port configured: ${port}`);

// Dynamic key endpoint (returns environment variables safely at runtime)
app.get('/api/config', (req, res) => {
  res.json({
    apiKey: process.env.VITE_GEMINI_API_KEY || ''
  });
});

// Serve static assets from Vite build output directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all routes to index.html for SPA client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`StadiumOS AI Server listening on port ${port}`);
});
