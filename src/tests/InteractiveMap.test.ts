import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import InteractiveStadiumMap from '../components/shared/InteractiveStadiumMap';

describe('InteractiveStadiumMap Component', () => {
  it('should render the stadium map SVG grid and the default telemetry card', () => {
    const handleConsultAI = vi.fn();
    render(React.createElement(InteractiveStadiumMap, { onConsultAI: handleConsultAI }));

    // Check header
    expect(screen.getByText(/FIFA Stadium Digital Twin Map/i)).toBeInTheDocument();
    
    // The default selected zone is Gate G
    expect(screen.getByRole('heading', { name: /Gate G Ingress \(East\)/i })).toBeInTheDocument();
    expect(screen.getByText(/Level 3 \(High Alert\)/i)).toBeInTheDocument();
  });

  it('should change the active telemetry details when another sensor node is clicked', () => {
    const handleConsultAI = vi.fn();
    render(React.createElement(InteractiveStadiumMap, { onConsultAI: handleConsultAI }));

    // Target the ADA Elevator 4 sensor node using the ARIA label
    const elevatorNode = document.querySelector('g[aria-label*="ADA Elevator 4"]');
    expect(elevatorNode).not.toBeNull();

    if (elevatorNode) {
      fireEvent.click(elevatorNode);
      // Panel details should update to Elevator 4 details
      expect(screen.getByRole('heading', { name: /ADA Elevator 4 Lobby/i })).toBeInTheDocument();
      expect(screen.getByText(/Dedicated priority elevator corridor/i)).toBeInTheDocument();
    }
  });

  it('should invoke onConsultAI with telemetry parameters when trigger button is clicked', () => {
    const handleConsultAI = vi.fn();
    render(React.createElement(InteractiveStadiumMap, { onConsultAI: handleConsultAI }));

    const queryBtn = screen.getByRole('button', { name: /Consult AI twin on Zone Telemetry/i });
    fireEvent.click(queryBtn);

    expect(handleConsultAI).toHaveBeenCalledTimes(1);
    expect(handleConsultAI.mock.calls[0][0]).toContain('Gate G Ingress (East)');
    expect(handleConsultAI.mock.calls[0][0]).toContain('Occupancy: 92%');
    expect(handleConsultAI.mock.calls[0][0]).toContain('Risk Level: CRITICAL');
  });
});
