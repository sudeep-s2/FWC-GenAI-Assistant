# StadiumOS AI: FIFA World Cup 2026 GenAI Operations Twin

StadiumOS AI is a next-generation GenAI-powered Operations Twin designed for managing operations, crowd flow, sustainability, fan support, and volunteer logistics for the FIFA World Cup 2026.

## Architecture

- **`src/components/`**: Domain-specific UI dashboards (Crowd, Fan, Volunteer, Sustainability, etc.).
- **`src/services/`**: AI agents, RAG engines, configuration, and API services (Gemini Integration).
- **`src/utils/`**: Utilities including validation, storage, and scenarios.
- **`src/context/`**: React application state context.
- **`src/types/`**: TypeScript type definitions.
- **`src/knowledge/`**: Domain knowledge for the RAG engine.

## User Interface Modules

StadiumOS AI implements a fully responsive dark-mode cockpit for venue managers, grouped into six interactive workspaces:
1. **Command Center**: Main digital twin twin telemetry. Features Recharts gauge/area charts, live incident tables, and the **Judge Demo Console**.
2. **CrowdPulse Risk**: Detailed outer-gate crowding metrics and serpentine detour recommendations.
3. **FanJourney AI**: Travel and arrival itinerary planner translating and localizing stadium routes.
4. **Volunteer Copilot**: Instruction manual and task dispatcher grounded in RAG database.
5. **ADA Guardian**: Dedicated accessibility helper routing disabled guests via elevators.
6. **Eco Optimizer**: Carbon footprint diagnostics and zero-waste checks.

## Getting Started

1. Set up your `.env` file with `VITE_GEMINI_API_KEY`.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.
4. Run `npm test` to run all 30 unit and integration tests.
5. Run `npm run build` to build the production-ready optimized build assets.

## User Experience & Onboarding

StadiumOS AI features:
* **First-Visit Onboarding Guide**: Explains the command center tabs and domain features in 30 seconds. Saves state in `localStorage`.
* **Light / Dark / System Tech Theme Support**: Toggles between dark glassmorphism, a clean high-contrast light mode, and a warm cozy tech milk tea / espresso styling.
* **InfoTooltips**: Quick guidance icons attached to key dashboards explaining metrics.
* **Interactive Empty States**: Empty logs show clean placeholder cards with quick reset options.
* **FIFA Match Context System**: Integrates 6 matchday phases (Arrival, Preparation, First Half, Half-Time, Second Half, Exit) directly affecting RAG search results and Gemini instructions.
* **30-Minute Predictive Operations**: Allows the operators to input ingress capacity rates and run a predictive risk forecast of crowd bottlenecks.
* **AI Explainability**: Shows a checkbox checklist of factors considered for every response, detailing live parameters, matching SOP documents, and active phases.
* **Multilingual Fan Presets**: Ingests queries in English, Spanish, French, Japanese, or Arabic.
* **Volunteer Action Logs**: Outputs structured Situation, Priority, Action, and Escalation summaries for task coordinators.

## Production Deployment

StadiumOS AI is designed for containerized deployment on **Google Cloud Run** (`asia-south1` region). The container separates built static assets from active credentials by dynamically resolving API keys from the hosting environment at runtime.

For build commands, container setups, and step-by-step deploy instructions, consult [DEPLOYMENT.md](file:///d:/Development/Projects/p4/DEPLOYMENT.md).

