import { useState, useCallback } from 'react';
import type { Persona } from '../types';

export interface PersonaInfo {
  id: Persona;
  label: string;
  focus: string;
  description: string;
}

export const PERSONAS: PersonaInfo[] = [
  {
    id: 'Fan',
    label: '👤 Fan / Spectator',
    focus: 'Seat navigation, transport schedules, and multilingual help cards',
    description: 'Tailored for international spectators needing stadium routing, languages, and logistics.'
  },
  {
    id: 'Volunteer',
    label: '🦺 Volunteer',
    focus: 'Incidents dispatch logs, SOP checklists, and radio guides',
    description: 'Designed for field volunteers seeking checklist protocols, dispatch, and escalation details.'
  },
  {
    id: 'Organizer',
    label: '🎧 Organizer / Venue Staff',
    focus: 'Matchday operations, predictive crowd risks, and resource charts',
    description: 'Created for organizers managing the operations center, predicting surges, and allocating staff.'
  },
  {
    id: 'Accessibility Guest',
    label: '♿ Accessibility Guest',
    focus: 'ADA routes, priority elevator access, and shuttle scheduling',
    description: 'Built for guests needing wheelchair pathways, shuttle scheduling, and sensory quiet rooms.'
  }
];

export function usePersona() {
  const [currentPersona, setPersonaState] = useState<Persona>(() => {
    const saved = localStorage.getItem('stadiumos-active-persona');
    return (saved as Persona) || 'Organizer';
  });

  const setPersona = useCallback((persona: Persona) => {
    setPersonaState(persona);
    localStorage.setItem('stadiumos-active-persona', persona);
  }, []);

  const personaInfo = PERSONAS.find(p => p.id === currentPersona) || PERSONAS[2]; // Default to Organizer

  return {
    currentPersona,
    personaInfo,
    setPersona,
    personas: PERSONAS
  };
}
