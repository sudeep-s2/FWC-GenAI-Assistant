import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersona } from '../hooks/usePersona';
import { AppProvider } from '../context/AppContext';

describe('usePersona custom hook', () => {
  it('should initialize with default Organizer persona', () => {
    const { result } = renderHook(() => usePersona(), { wrapper: AppProvider });
    expect(result.current.currentPersona).toBe('Organizer');
    expect(result.current.personaInfo.id).toBe('Organizer');
    expect(result.current.personaInfo.focus.toLowerCase()).toContain('operations');
  });

  it('should allow setting a new persona role and persist focus details', () => {
    const { result } = renderHook(() => usePersona(), { wrapper: AppProvider });
    
    act(() => {
      result.current.setPersona('Volunteer');
    });

    expect(result.current.currentPersona).toBe('Volunteer');
    expect(result.current.personaInfo.focus.toLowerCase()).toContain('incident');
  });
});
