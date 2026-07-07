import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersona } from '../hooks/usePersona';

describe('usePersona custom hook', () => {
  it('should initialize with default Organizer persona', () => {
    const { result } = renderHook(() => usePersona());
    expect(result.current.currentPersona).toBe('Organizer');
    expect(result.current.personaInfo.id).toBe('Organizer');
    expect(result.current.personaInfo.focus.toLowerCase()).toContain('operations');
  });

  it('should allow setting a new persona role and persist focus details', () => {
    const { result } = renderHook(() => usePersona());
    
    act(() => {
      result.current.setPersona('Volunteer');
    });

    expect(result.current.currentPersona).toBe('Volunteer');
    expect(result.current.personaInfo.focus.toLowerCase()).toContain('incident');
  });
});
