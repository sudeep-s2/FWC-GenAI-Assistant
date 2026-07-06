import type { StadiumScenario } from '../types';

export const demoScenarios: StadiumScenario[] = [
  {
    id: 'scen-surge-emergency',
    title: 'Crowd Surge Emergency at Gate G',
    description: 'High crowd density bottleneck detected at Gate G ticket scanning lanes. Incoming transit shuttle has just arrived.',
    type: 'surge',
    severity: 'critical',
    parameters: {
      stadiumArea: 'Gate G Outer Perimeter',
      crowdPercentage: 92,
      riskIndicators: ['Density > 4.5 people/m2', 'Aggressive pushing', 'Queue spillover into transit roadway']
    }
  },
  {
    id: 'scen-lost-fan',
    title: 'Lost International Fan',
    description: 'A Japanese-speaking spectator is lost near the North Concourse and cannot locate their seat.',
    type: 'lost-fan',
    severity: 'low',
    parameters: {
      language: 'Japanese',
      seatLocation: 'Sector B, Row 12, Seat 4',
      assistanceNeeded: 'Visual escort to seat, translation of ticket details'
    }
  },
  {
    id: 'scen-accessibility-request',
    title: 'Wheelchair Accessibility Assist',
    description: 'An elderly visitor arriving at the Light Rail Station requires wheelchair transport to their seat in Sector C.',
    type: 'accessibility',
    severity: 'medium',
    parameters: {
      accessibilityRequirement: 'Wheelchair push assistance, ADA elevator access',
      currentLocation: 'Light Rail Station ADA Gate',
      destination: 'Sector C, Section 104'
    }
  },
  {
    id: 'scen-maintenance-incident',
    title: 'Corridor Water Spill & Blocked Route',
    description: 'A major liquid spill has been reported in the main corridor near gate C-3, causing a slippery hazard and blocking wheelchair access.',
    type: 'maintenance',
    severity: 'high',
    parameters: {
      issue: 'Slippery floor, blocked wheelchair pathway',
      currentLocation: 'Concourse Corridor C-3',
      priority: 'high'
    }
  },
  {
    id: 'scen-sustainability-optimization',
    title: 'Food Court 3 Recycling Contamination',
    description: 'High rate of plastic water bottles detected in general waste bins at Food Court 3, violating zero-waste goals.',
    type: 'sustainability',
    severity: 'medium',
    parameters: {
      energyUsage: '105% capacity',
      wasteMetrics: '62% contamination rate of recycling streams',
      transportLoad: 'Normal'
    }
  }
];
