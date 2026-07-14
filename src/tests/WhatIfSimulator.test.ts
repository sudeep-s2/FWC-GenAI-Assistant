import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WhatIfSimulator from '../components/dashboard/WhatIfSimulator';
import type { AIResponse } from '../types';

describe('WhatIfSimulator contingency planner', () => {
  const mockRunSimulation = vi.fn();

  const mockResponse: AIResponse = {
    content: `### Situation
[What-If Simulation] Spill incident.

### Risk Level
HIGH

### Root Cause
Water leak.

### Recommended Actions
Divert lines.

### Required Personnel
Ushers.

### Expected Impact
Safe detour.

### Confidence
HIGH

### Evidence
SOP.`,
    source: 'OFFLINE_INTELLIGENCE',
    confidence: 'high',
    citations: [],
    actions: ['Divert crowd'],
    factorsConsidered: ['✓ Spill'],
    metadata: {
      priority: 'high'
    }
  };

  it('should render preset select, custom input, and submit button', () => {
    render(
      React.createElement(WhatIfSimulator, {
        onRunSimulation: mockRunSimulation,
        loading: false,
        response: null,
        elapsedMs: null
      })
    );

    expect(screen.getByRole('heading', { name: /Scenario Simulator/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Preset Contingency/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., What if the elevator/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run Operations Simulation/i })).toBeInTheDocument();
  });

  it('should fire simulation callback with chosen preset scenario', async () => {
    render(
      React.createElement(WhatIfSimulator, {
        onRunSimulation: mockRunSimulation,
        loading: false,
        response: null,
        elapsedMs: null
      })
    );

    const select = screen.getByLabelText(/Select Preset Contingency/i);
    // Option 1
    fireEvent.change(select, { target: { value: '[What-If Simulation] Two medical standby crews in Sector B are dispatched and now unavailable. Assess cascade risks and outline emergency staffing redirection plans under current density load.' } });

    const btn = screen.getByRole('button', { name: /Run Operations Simulation/i });
    fireEvent.click(btn);

    expect(mockRunSimulation).toHaveBeenCalledWith(
      expect.stringContaining('Two medical standby crews')
    );
  });

  it('should fire simulation callback with typed custom scenario', async () => {
    render(
      React.createElement(WhatIfSimulator, {
        onRunSimulation: mockRunSimulation,
        loading: false,
        response: null,
        elapsedMs: null
      })
    );

    const input = screen.getByPlaceholderText(/e.g., What if the elevator/i);
    fireEvent.change(input, { target: { value: 'What if elevator 3 is down?' } });

    const btn = screen.getByRole('button', { name: /Run Operations Simulation/i });
    fireEvent.click(btn);

    expect(mockRunSimulation).toHaveBeenCalledWith('What if elevator 3 is down?');
  });

  it('should show error when running with empty values', () => {
    render(
      React.createElement(WhatIfSimulator, {
        onRunSimulation: mockRunSimulation,
        loading: false,
        response: null,
        elapsedMs: null
      })
    );

    const btn = screen.getByRole('button', { name: /Run Operations Simulation/i });
    fireEvent.click(btn);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Please select a preset/i)).toBeInTheDocument();
  });

  it('should render loading indicator during execution', () => {
    render(
      React.createElement(WhatIfSimulator, {
        onRunSimulation: mockRunSimulation,
        loading: true,
        response: null,
        elapsedMs: null
      })
    );

    expect(screen.getByText(/Modeling operational impact twin/i)).toBeInTheDocument();
  });

  it('should render AIResponseCard details when response is ready', () => {
    render(
      React.createElement(WhatIfSimulator, {
        onRunSimulation: mockRunSimulation,
        loading: false,
        response: mockResponse,
        elapsedMs: 250
      })
    );

    expect(screen.getByText(/Contingency Simulation Mode Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Water leak/i)).toBeInTheDocument();
    expect(screen.getByText(/Divert crowd/i)).toBeInTheDocument();
  });
});
