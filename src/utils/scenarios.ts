import type { StadiumScenario } from '../types';

export const demoScenarios: StadiumScenario[] = [
  {
    id: 'scen-surge-emergency',
    title: 'FIFA 2026 Crowd Surge at Gate G',
    description: 'Critical spectator density bottleneck detected at Gate G Ticket Entry. Transit arrival drops are currently at peak frequency.',
    type: 'surge',
    severity: 'critical',
    parameters: {
      stadiumArea: 'Gate G Outer Perimeter',
      crowdPercentage: 92,
      riskIndicators: ['Density > 4.5 spectators/m2', 'Line pacing breach', 'Queue spillover into transit lanes']
    }
  },
  {
    id: 'scen-lost-fan',
    title: 'Lost Japanese Spectator at Info Desk',
    description: 'A lost Japanese-speaking fan at Concourse Info Point 2 requires ticketing validation and translation escort.',
    type: 'lost-fan',
    severity: 'low',
    parameters: {
      language: 'Japanese',
      seatLocation: 'Sector B, Row 12, Seat 4',
      assistanceNeeded: 'Ticketing validation, visual pathway escort'
    }
  },
  {
    id: 'scen-accessibility-request',
    title: 'FIFA ADA Wheelchair Transit Assist',
    description: 'Elderly guest arriving at Light Rail Transit Hub requires companion wheelchair shuttle to Sector C seating deck.',
    type: 'accessibility',
    severity: 'medium',
    parameters: {
      accessibilityRequirement: 'Wheelchair cart shuttle, ADA lift priority routing',
      currentLocation: 'Light Rail Station ADA Gate',
      destination: 'Sector C, Section 104'
    }
  },
  {
    id: 'scen-maintenance-incident',
    title: 'Hazard Spill blocking ADA Concourse Route',
    description: 'Slippery spill hazard reported at Concourse Corridor C-3, blocking wheelchair passageway to Sector C exit ramps.',
    type: 'maintenance',
    severity: 'high',
    parameters: {
      issue: 'Spill hazard blocking ADA exit lanes',
      currentLocation: 'Concourse Corridor C-3',
      priority: 'high'
    }
  },
  {
    id: 'scen-sustainability-optimization',
    title: 'Zero-Waste Station Contamination',
    description: 'Recycling contamination flagged at Concourse Food Plaza 3, violating FIFA zero-waste protocol.',
    type: 'sustainability',
    severity: 'medium',
    parameters: {
      energyUsage: '105% capacity',
      wasteMetrics: '62% contamination of recycling bins',
      transportLoad: 'Peak'
    }
  }
];
