import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import MatchHeader from '../components/dashboard/MatchHeader';
import CrowdWidget from '../components/dashboard/CrowdWidget';
import TransportWidget from '../components/dashboard/TransportWidget';
import IncidentWidget from '../components/dashboard/IncidentWidget';
import VolunteerWidget from '../components/dashboard/VolunteerWidget';

// Mock Recharts to avoid jsdom layout dimensions warnings
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 200 }}>{children}</div>
    ),
  };
});

const mockPhaseInfo = {
  id: 'PRE_MATCH' as const,
  label: 'Pre-Match (T-3 Hours)',
  focusArea: 'Transit hub loads, parking lot allocations, perimeter gate flow, and arrival waves.',
  description: 'Spectators traveling to stadium.'
};

const mockPersonaInfo = {
  id: 'Organizer' as const,
  label: '🎧 Organizer / Venue Staff',
  focus: 'Matchday operations, predictive crowd risks, and resource charts',
  description: 'Created for organizers managing the operations center.'
};

describe('Dashboard Sub-Widgets', () => {
  it('MatchHeader should render system title, selections and attendance', () => {
    render(
      <MatchHeader
        currentPhase="PRE_MATCH"
        phaseInfo={mockPhaseInfo}
        setPhase={vi.fn()}
        phases={[mockPhaseInfo]}
        currentPersona="Organizer"
        personaInfo={mockPersonaInfo}
        setPersona={vi.fn()}
        personas={[mockPersonaInfo]}
        attendance={82411}
      />
    );
    expect(screen.getByText('FIFA World Cup 2026 Real-Time Operations Intelligence System')).toBeInTheDocument();
    expect(screen.getByText('82,411')).toBeInTheDocument();
    expect(screen.getByText(/Transit hub loads/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Matchday operations/i).length).toBeGreaterThan(0);
  });

  it('CrowdWidget should render Peak Density indicators and chart description', () => {
    const crowdData = [{ time: '14:00', density: 12 }];
    render(<CrowdWidget crowdData={crowdData} />);
    expect(screen.getByText('Crowd Density Metrics')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('TransportWidget should render ingress bars and tooltip descriptive maps', () => {
    const gateData = [{ gate: 'A', flow: 850, capacity: 1200 }];
    render(<TransportWidget gateData={gateData} />);
    expect(screen.getByText('FIFA Ingress Flow vs. Capacity')).toBeInTheDocument();
  });

  it('IncidentWidget should render live incidents logs or all clear empty states', () => {
    render(<IncidentWidget />);
    expect(screen.getByText('Live Incident Log')).toBeInTheDocument();
    expect(screen.getByText('INC-001')).toBeInTheDocument();
  });

  it('VolunteerWidget should render channel details and volunteers allocations count', () => {
    render(<VolunteerWidget volunteersCount={142} />);
    expect(screen.getByText('Field Logistics')).toBeInTheDocument();
    expect(screen.getByText('142 Amb.')).toBeInTheDocument();
    expect(screen.getByText(/CH 1: Ingress Operations/i)).toBeInTheDocument();
  });
});
