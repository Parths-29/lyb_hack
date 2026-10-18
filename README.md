# Sugarcane Architecture Demo

Three architectural implementations of the DesiCane irrigation advisory system.

## Plant X Energy Advisor prototype

The root URL opens the illustrative, client-only Plant X Energy Advisor demo. It includes synthetic recommendations, explainable decisions, safety guardrails, a normalized energy chart, and sensitivity controls.

### Deploy to Vercel

1. Import this GitHub repository into Vercel and keep the project root set to the repository root.
2. Vercel reads the root `vercel.json`, installs the frontend dependencies, builds the Vite app, and serves `frontend/dist`.
3. Deploy. No environment variables or backend services are needed for this prototype.

For a local preview: `cd frontend`, `npm install`, then `npm run dev`.

## Running

1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Monolith**:
   ```bash
   cd monolith
   docker compose up --build
   ```
   (Set `VITE_API_BASE_URL=http://localhost:4000` in frontend `.env.example`)

3. **Three-Tier**:
   ```bash
   cd three-tier
   docker compose up --build
   ```
   (Set `VITE_API_BASE_URL=http://localhost:80` in frontend `.env.example`)

4. **Microservices**:
   ```bash
   cd microservices
   docker compose up --build
   ```
   (Set `VITE_API_BASE_URL=http://localhost:8000` in frontend `.env.example`)

See `/docs` for full details.

For the Redis, Prometheus, and Grafana live demo workflow, see [`docs/devops-demo.md`](docs/devops-demo.md).
