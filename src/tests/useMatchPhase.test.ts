import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMatchPhase } from '../hooks/useMatchPhase';

describe('useMatchPhase custom hook', () => {
  it('should initialize with default PRE_MATCH phase', () => {
    const { result } = renderHook(() => useMatchPhase());
    expect(result.current.currentPhase).toBe('PRE_MATCH');
    expect(result.current.phaseInfo.focusArea).toContain('Transit');
  });

  it('should allow setting a new active match phase', () => {
    const { result } = renderHook(() => useMatchPhase());
    
    act(() => {
      result.current.setPhase('HALFTIME');
    });

    expect(result.current.currentPhase).toBe('HALFTIME');
    expect(result.current.phaseInfo.focusArea).toContain('Concourse');
  });
});
