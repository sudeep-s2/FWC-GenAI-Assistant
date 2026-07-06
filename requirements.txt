STADIUMOS AI PRODUCTION REQUIREMENTS
====================================

1. Functional Requirements:
   - **Command Center Dashboard**: Provide live visual twin telemetry metrics, incident log grids, and charts (density, gate loads).
   - **RAG Grounding**: Local retrieval must read from the four JSON database files (SOPs, Accessibility, Volunteers, Emergency Protocols) and inject grounding contexts with cited sources, sections, and IDs.
   - **AI Orchestrator**: Processes operator input through sanitization, intent mapping, cache lookup, rate limiting, and Gemini API structured fetch.
   - **Function Calling**: Validates and executes mock operational tools (dispatchVolunteer, dispatchMaintenance, rerouteCrowd, sendAlert) with parameter safety boundaries.
   - **One-Click Showcase**: Implement a Judge Demo Panel triggering real AI pipeline flows for five core stadium scenarios.
   - **Graceful Fallbacks**: Offline intelligence must activate transparently when APIs fail, keys are invalid, or rate limits are reached, returning standard typed schemas with warning indicators.

2. Security & Safety Requirements:
   - **Sanitization**: Escape HTML boundaries and prevent scripting injection.
   - **Code Auditing**: Do not use eval(), innerHTML, dangerouslySetInnerHTML, or expose sensitive keys in logs or git.
   - **Session Rate Limiting**: Limit sessions to 30 API calls to protect Gemini quotas.

3. Accessibility Requirements:
   - **Screen Reader Support**: Use aria-labels on graphs, list logs, and buttons.
   - **Semantic Layout**: Restrict code structures to standard HTML5 semantic elements.
   - **Keyboard Navigation**: Provide distinct visual focus rings for keyboard-only users.

4. Performance & Telemetry Requirements:
   - **Lazy Loading**: Code-split view panels with React.lazy and Suspense loading indicators.
   - **File Limits**: Keep all interactive components strictly under 250 lines for clean maintenance.
