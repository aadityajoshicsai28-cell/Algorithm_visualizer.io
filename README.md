# AlgoLens

AlgoLens is a React and Vite algorithm visualizer with an Express metadata API. It provides interactive visualizations for sorting, pathfinding, data structures, graph algorithms, and math/recursion topics.

**Live demo:** [algorithm-visualizer-io-rb6c-delta.vercel.app](https://algorithm-visualizer-io-rb6c-delta.vercel.app/)

## Features

- Step-through algorithm visualizations with play, pause, reset, and speed controls.
- Sorting visualizations with bar-chart rendering.
- Pathfinding visualizations on an interactive grid.
- Data structure views for linked lists, trees, and tables.
- Graph algorithm visualizations on a canvas.
- Math and recursion visualizations.
- Complexity references and algorithm metadata served by the backend API.

## Project Layout

- `frontend/`: React application, visual engines, renderers, and page routes.
- `backend/`: Express API serving algorithm categories and metadata.
- `backend/data/algorithmsMetadata.json`: metadata source used by the API.

The frontend also includes a local metadata fallback, so the visualization pages remain usable when the API is unavailable.

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Local Development

Install dependencies in each package:

```bash
cd frontend
npm install
cd ../backend
npm install
```

Start the backend in one terminal:

```bash
cd backend
npm start
```

Start the Vite development server in another terminal:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

On Windows PowerShell systems where `npm.ps1` is blocked by execution policy, use `npm.cmd` or run the commands from Command Prompt:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## Environment Variables

Copy the example files before changing deployment settings:

```text
frontend/.env.example -> frontend/.env
backend/.env.example -> backend/.env
```

Frontend:

- `VITE_API_BASE_URL`: API base URL, including `/api`. Local default: `http://localhost:5000/api`.

Backend:

- `PORT`: HTTP port. Defaults to `5000` and must be a valid port from 1 to 65535.
- `CORS_ORIGIN`: allowed frontend origin. Use the exact deployed frontend URL in production instead of `*`.

## Verification Commands

Frontend production build:

```bash
cd frontend
npm run build
```

Frontend lint:

```bash
cd frontend
npm run lint
```

Frontend preview of the production bundle:

```bash
cd frontend
npm run preview
```

Backend API checks:

```text
GET http://localhost:5000/api/health
GET http://localhost:5000/api/categories
GET http://localhost:5000/api/algorithms
GET http://localhost:5000/api/algorithms/:id
```

## Production Deployment

### Single Node service

The backend serves `frontend/dist` automatically when that directory exists. A platform that supports build and start commands can use:

Build command:

```bash
cd frontend && npm ci && npm run build && cd ../backend && npm ci
```

Start command:

```bash
cd backend && npm start
```

Set `PORT` from the hosting platform. Set `CORS_ORIGIN` to the deployed site URL. The health check path is `/api/health`.

### Separate frontend and backend services

For a static frontend host:

1. Build the frontend with `npm ci && npm run build` from `frontend/`.
2. Publish `frontend/dist` as the static output directory.
3. Set `VITE_API_BASE_URL` to the deployed backend URL ending in `/api` before building.
4. Configure the static host to serve `index.html` for unknown routes because the app uses client-side routing.

For the backend host:

1. Deploy `backend/` with `npm ci` as the install step.
2. Start it with `npm start`.
3. Set `CORS_ORIGIN` to the frontend origin.
4. Use `/api/health` as the health check endpoint.

### Vercel

This repository contains two applications. Deploy them as separate Vercel projects:

- Frontend project: set **Root Directory** to `frontend`.
- Backend project: set **Root Directory** to `backend` and use `npm start` as the start command.

For the frontend project, set `VITE_API_BASE_URL` to the deployed backend URL ending in `/api` before building. For the backend project, set `CORS_ORIGIN` to the deployed frontend URL.

Do not commit `.env` files. The committed `.env.example` files contain only non-secret defaults.

## Deployment Notes

- The backend metadata is read from `backend/data/algorithmsMetadata.json` at startup.
- Any metadata file changes require a backend restart.
- The frontend fallback metadata protects the UI from temporary API outages, but production deployments should still monitor `/api/health`.
- No database or persistent user data is required.
