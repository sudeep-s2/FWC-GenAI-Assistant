# GenAI Proof of Concept (POC) - StadiumOS AI

This document serves as proof of implementation and architectural validation for the Gemini integration, AI agents, and RAG components.

## AI Engine Config
- Model: Gemini 2.5/3.5 family
- APIs: Google GenAI SDK (React web-ready)
- Orchestration: Dynamic router (aiOrchestrator)

## Agent Capabilities
1. **Crowd Agent**: Monitors gate flow, predicts bottlenecks, and suggests dispersal routes.
2. **Fan Agent**: Provides multi-lingual real-time stadium assistance.
3. **Volunteer Coordinator**: Manages volunteer schedules and dispatches task assistance.
4. **Sustainability/Accessibility Agent**: Monitors recycling compliance and handles accessibility requests.

## Test Validation
- Vitest-driven prompt response simulation.
- Fallback agent coverage.

## RAG Architecture
The local RAG retrieval system implements case-insensitive token/keyword and exact phrase matching. It compiles corresponding documents into structured prompt contexts. The AI twin later uses this context to construct answers containing precise citations.

### Retrieval Flow:
1. **Query Input**: Receives operator query or scenario metrics.
2. **Keyword Scan**: Extract tokens and matches title, tags, or content.
3. **Context Compiler**: Formats matched items as:
   `Source: [document_name] | Section: [section] | ID: [id] | Title: [title]`
4. **LLM Prompt Payload**: Merged context is loaded into system prompts for downstream agent execution.

## Knowledge Sources
- **stadium_sop.json**: Protocols for crowd control, ticketing checkpoints, security escalation, and fan assistance.
- **accessibility_rules.json**: ADA pathways, companion seating rules, sensory quiet rooms, and elderly transport.
- **volunteer_manual.json**: Volunteer shifting, lost children procedures, translation services, and radio channel hygiene.
- **emergency_protocols.json**: Medical EMS routing, blocked evacuation detours, heat/lightning suspensions, and gate lockouts.

## Phase 3: GenAI Core Engine

### Gemini Integration
- **Model**: `gemini-2.5-flash` via direct `fetch` to `https://generativelanguage.googleapis.com/v1beta/models`
- **API Key**: Read from `VITE_GEMINI_API_KEY` environment variable at runtime. Never hardcoded.
- **Structured Output**: `responseMimeType: application/json` is enforced in `generationConfig` so responses are always parseable JSON matching the `AIResponse` schema.
- **Safety Settings**: All four harm categories configured at `BLOCK_MEDIUM_AND_ABOVE` threshold.

### API Request Flow
```
User Query
  → sanitizeInput()        (HTML strip, char escape)
  → validatePrompt()       (size check, injection patterns)
  → detectIntent()         (surge | accessibility | volunteer | maintenance | sustainability)
  → RAGEngine.getContextForPrompt()  (keyword match → context string with citations)
  → AICache.get()          (localStorage 5-min TTL lookup)
  → rateLimiter()          (session guard: 30 calls max)
  → GeminiService.generateStructuredResponse()  (fetch with 10s AbortController)
  → Response Validation    (check content & actions fields)
  → AICache.set()          (cache success response)
  → Return AIResponse      (source: 'GEMINI')
```

### Failure Flow
```
Any step above fails
  → FallbackAI.getScenarioFallback(intent)
  → AICache.incrementMetric('fallbackActivations')
  → Return AIResponse      (source: 'OFFLINE_INTELLIGENCE')
```

### Quota Protection
- **Session Limit**: 30 Gemini API calls per browser session tracked via `sessionStorage`.
- **Cache TTL**: 5-minute localStorage cache to reuse identical queries.
- **Timeout**: 10-second `AbortController` signal prevents hung requests.
- **Graceful Degradation**: All quota exhaustion or API failures route to `FallbackAI` — never surfaces raw errors to the UI.

### Function Calling Engine
- Tools: `dispatchVolunteer`, `dispatchMaintenance`, `rerouteCrowd`, `sendAlert`
- All tools validated against strict argument schemas before execution.
- Unknown tool calls are rejected with `success: false`.

## Phase 4: UI Integration & Digital Twin Dashboard

### React Interface Architecture
- **CommandCenter (`components/dashboard/CommandCenter.tsx`)**: Central hub containing live telemetry widgets, incident logging tables, Recharts visualizations, and a Judge Demo panel.
- **CrowdPulse (`components/crowd/CrowdPulse.tsx`)**: Connects to the orchestrator to provide crowd risk analysis, RadialBar density gauges, and gate capacity load progress bars.
- **FanJourneyAI (`components/fan/FanJourneyAI.tsx`)**: Takes user inputs (seat, language, access needs, transport) and queries Gemini to create custom itinerary plans.
- **VolunteerCopilot (`components/volunteer/VolunteerCopilot.tsx`)**: Integrates RAG-backed guides for volunteer incident reporting and active tasks.
- **AccessibilityGuardian (`components/accessibility/AccessibilityGuardian.tsx`)**: Guides disabled and elderly spectators to correct ADA gates, lifts, and sensory areas.
- **SustainabilityAI (`components/sustainability/SustainabilityAI.tsx`)**: Zero-waste recommendations and carbon offset diagnostics.

### Shared & Auxiliary Components
- **AIResponseCard (`components/shared/AIResponseCard.tsx`)**: Rendered wrapper displaying response confidence, RAG citations, actions, response time, and source.
- **AIStatusPanel (`components/shared/AIStatusPanel.tsx`)**: Polls localStorage cache metrics and sessionStorage rate limits to draw quota bars.

### Telemetry & Performance Optimization
- **React.lazy & Suspense**: Asynchronously loads tabs (e.g. CrowdPulse, VolunteerCopilot) to optimize bundle size and page loading speed.
- **React.memo**: Applied on card elements and status indicators to avoid unnecessary re-renders.

### Testing Verification
- Component renders verified in jsdom using `@testing-library/react` and `vitest`.
- Recharts responsive wrappers mocked to prevent dimensions failure in virtual DOM.

---

## Phase 8: FIFA 2026 Score Optimization & Explainability

### 1. Matchday Intelligence Layer
- **Match phases**: Integrates 4 consolidated match phases (`PRE_MATCH`, `ENTRY`, `HALFTIME`, `POST_MATCH`) that dynamically direct RAG search queries and model system guidelines based on active venue schedules.
- **Hook Integration**: Exposes phase changes and descriptions to widgets via `useMatchPhase.ts` and `useMatchContext.ts` hooks.

### 2. 30-Minute Predictive Operations
- **Forecast Engine**: Adds a 30-minute predictive risk simulation that inputs capacity load levels and outputs structured forecast objects (`currentStatus`, `predictedIssue`, `estimatedTime`, `confidence`, `preventionSteps`).
- **Reroute Actions**: Generates transport-specific staff detours, arrival wave buffers, and shuttle pacing plans.

### 3. Persona Engine Integration
- **Active Roles**: Allows choosing between `Fan`, `Volunteer`, `Organizer`, and `Accessibility Guest` roles. Adjusts RAG retrieval parameters and system prompts depending on the active role profile.
- **Hook Integration**: Manages role selections and descriptions via `usePersona.ts`.

### 4. AI Explainability Checklists
- **Factors Display**: Model outputs and fallback scenarios list precise considerations (e.g. `✓ Match phase: PRE_MATCH`, `✓ Crowd density`, `✓ Stadium SOP`, `✓ Transport status`, `✓ Accessibility requirements`), showing operators exactly which variables were evaluated.

### 5. Decomposed Architecture & Tests
- **Smaller Components**: Decomposed `CommandCenter` into main `index.tsx`, `MatchHeader.tsx`, `CrowdWidget.tsx`, `TransportWidget.tsx`, `IncidentWidget.tsx`, and `VolunteerWidget.tsx`. All components are strictly under 250 lines.
- **Reusable UI Elements**: Reusable `LoadingState.tsx` and `EmptyState.tsx`.
- **Testing Verification**: Expanded test suites to 11 test files and 39 tests verifying hooks, widgets, security, rate limiters, and RAG pipelines.


