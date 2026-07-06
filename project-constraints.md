# Project Constraints - StadiumOS AI

This document tracks constraints regarding security, environments, performance, and APIs.

## Constraints
- **Secrets Management**: No API keys or credentials must ever be committed to git. Use local `.env` and verify ignore rules.
- **AI Dependencies**: Frontend-compatible SDK calls only; avoid server-only node dependencies where possible.
- **Component Isolation**: AI orchestrator must operate independently of the presentation layer to allow clean upgrades.
- **Offline / Degraded Operation**: When the network or AI API fails, the dashboard must fall back to basic rule-based analytics.
