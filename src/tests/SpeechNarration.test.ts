import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AIResponseCard from '../components/shared/AIResponseCard';
import type { AIResponse } from '../types';

describe('AIResponseCard Speech Narration & Telemetry widgets', () => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockGetVoices = vi.fn().mockReturnValue([]);

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock speech synthesis on global window object
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: mockGetVoices,
        paused: false,
        pending: false,
        speaking: false,
      },
    });

    // Mock SpeechSynthesisUtterance class
    (globalThis as any).SpeechSynthesisUtterance = class {
      text: string;
      lang = 'en';
      onend = null;
      onerror = null;
      constructor(text: string) {
        this.text = text;
      }
    };
  });

  const mockResponse: AIResponse = {
    content: 'Buffer perimeter streams and open auxiliary Gate F and H.',
    source: 'OFFLINE_INTELLIGENCE',
    confidence: 'high',
    citations: [],
    actions: ['Divert Gate G traffic to Gate F'],
    factorsConsidered: ['✓ Crowd density', '✓ Stadium SOP'],
    metadata: {
      priority: 'high'
    }
  };

  it('should render confidence meter and factors considered indicators', () => {
    render(React.createElement(AIResponseCard, { response: mockResponse }));

    // Expect confidence meter percent
    expect(screen.getByText('92%')).toBeInTheDocument();
    
    // Expect evidence checklist
    expect(screen.getByText(/Crowd density/i)).toBeInTheDocument();
    expect(screen.getByText(/Stadium SOP/i)).toBeInTheDocument();
  });

  it('should trigger browser voice narration speak on button click', () => {
    render(React.createElement(AIResponseCard, { response: mockResponse }));

    const narrateBtn = screen.getByRole('button', { name: /narrate response text/i });
    expect(narrateBtn).toBeInTheDocument();

    // Click to start narration
    fireEvent.click(narrateBtn);

    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should cancel voice narration when clicking stop narration during play', () => {
    render(React.createElement(AIResponseCard, { response: mockResponse }));

    const btn = screen.getByRole('button', { name: /narrate response text/i });
    
    // Start speaking
    fireEvent.click(btn);
    expect(mockSpeak).toHaveBeenCalledTimes(1);

    // Button label toggles to Stop
    const stopBtn = screen.getByRole('button', { name: /stop speech narration/i });
    expect(stopBtn).toBeInTheDocument();

    // Click to cancel speaking
    fireEvent.click(stopBtn);
    expect(mockCancel).toHaveBeenCalledTimes(2); // Cancel is called on initial speak reset and stop click
  });
});
