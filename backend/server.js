import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const configuredPort = Number(process.env.PORT);
const PORT = Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort <= 65535
  ? configuredPort
  : 5000;
const allowedOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: allowedOrigin === '*' ? true : allowedOrigin }));
app.use(express.json());

// Load metadata
const metadataPath = path.join(__dirname, 'data', 'algorithmsMetadata.json');
let metadata = { categories: [], algorithms: {} };

try {
  const raw = fs.readFileSync(metadataPath, 'utf8');
  metadata = JSON.parse(raw);
} catch (err) {
  console.error('Error loading algorithms metadata:', err);
}

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', (req, res) => {
  res.json(metadata.categories || []);
});

app.get('/api/algorithms', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = Object.values(metadata.algorithms).filter(
      (a) => a.category === category
    );
    return res.json(filtered);
  }
  res.json(metadata.algorithms || {});
});

app.get('/api/algorithms/:id', (req, res) => {
  const algo = metadata.algorithms[req.params.id];
  if (!algo) {
    return res.status(404).json({ error: 'Algorithm not found' });
  }
  res.json(algo);
});

// Serve frontend build in production if available
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
