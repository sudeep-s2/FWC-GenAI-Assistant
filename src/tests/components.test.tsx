import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import AIResponseCard from '../components/shared/AIResponseCard';
import AIStatusPanel from '../components/shared/AIStatusPanel';
import CommandCenter from '../components/dashboard/CommandCenter';
import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';
import { AppProvider } from '../context/AppContext';
import ThemeToggle from '../components/shared/ThemeToggle';
import OnboardingGuide from '../components/shared/OnboardingGuide';
import InfoTooltip from '../components/shared/InfoTooltip';

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

describe('AIResponseCard Component', () => {
  it('should render Gemini source badge and citations correctly', () => {
    const mockResponse = {
      content: 'Gates should be redirected.',
      source: 'GEMINI' as const,
      confidence: 'high',
      citations: [{ source: 'stadium_sop.json', section: 'SOP-01', id: 'sop-surge' }],
      actions: ['Deploy barriers'],
      metadata: { priority: 'high' as const }
    };

    render(<AIResponseCard response={mockResponse} elapsedMs={120} />);
    
    expect(screen.getByText('Gates should be redirected.')).toBeInTheDocument();
    expect(screen.getByText('GEMINI AI')).toBeInTheDocument();
    expect(screen.getByText('Deploy barriers')).toBeInTheDocument();
    expect(screen.getByText('High Confidence')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render Offline Intelligence source badge correctly', () => {
    const mockResponse = {
      content: 'Offline recommendations active.',
      source: 'OFFLINE_INTELLIGENCE' as const,
      confidence: 'medium',
      citations: [],
      actions: [],
      metadata: {}
    };

    render(<AIResponseCard response={mockResponse} />);
    
    expect(screen.getByText('OFFLINE INTELLIGENCE')).toBeInTheDocument();
    expect(screen.getByText('Offline recommendations active.')).toBeInTheDocument();
  });
});

describe('AIStatusPanel Component', () => {
  it('should render status headers and metrics', () => {
    render(<AIStatusPanel />);
    expect(screen.getByText('AI System Status')).toBeInTheDocument();
    expect(screen.getByText('Gemini Status')).toBeInTheDocument();
  });
});

describe('CommandCenter Dashboard Component', () => {
  it('should render CommandCenter tabs, titles, and KPIs', () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <CommandCenter />
        </ThemeProvider>
      </AppProvider>
    );
    
    expect(screen.getByText('FIFA World Cup 2026 Real-Time Operations Intelligence System')).toBeInTheDocument();
    expect(screen.getByText('Spectator Load')).toBeInTheDocument();
    expect(screen.getByText('Active FIFA Incidents')).toBeInTheDocument();
    expect(screen.getByText('Live Incident Log')).toBeInTheDocument();
  });

  it('should trigger AI flow when clicking a Judge Demo Scenario button', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{}' }] } }]
      })
    });
    globalThis.fetch = mockFetch;

    render(
      <AppProvider>
        <ThemeProvider>
          <CommandCenter />
        </ThemeProvider>
      </AppProvider>
    );
    
    const surgeBtn = screen.getByRole('button', { name: /Run demo scenario: FIFA 2026 Crowd Surge at Gate G/i });
    expect(surgeBtn).toBeInTheDocument();
    
    fireEvent.click(surgeBtn);
    
    expect(screen.getByText(/Orchestrating RAG context/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Immediate crowd surge/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('App Main Entry Navigation', () => {
  it('should render and allow switching dashboard tabs', async () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AppProvider>
    );
    
    expect(screen.getByText('FIFA World Cup 2026')).toBeInTheDocument();
    
    const fanTabs = screen.getAllByRole('button', { name: /FanJourney AI/i });
    fireEvent.click(fanTabs[0]);
    
    await waitFor(() => {
      expect(screen.getByText('FanJourney AI — Personalized Matchday Planner')).toBeInTheDocument();
    });
  });
});

describe('Theme Context and Toggling', () => {
  it('should render theme toggler and toggle active classes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Initial state: Light/Dark/System buttons exist
    const lightBtn = screen.getByRole('button', { name: /Light/i });
    const darkBtn = screen.getByRole('button', { name: /Dark/i });
    const systemBtn = screen.getByRole('button', { name: /System/i });
    expect(lightBtn).toBeInTheDocument();
    expect(darkBtn).toBeInTheDocument();
    expect(systemBtn).toBeInTheDocument();

    // Toggle Light
    fireEvent.click(lightBtn);
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Toggle Dark
    fireEvent.click(darkBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle System
    fireEvent.click(systemBtn);
    expect(document.documentElement.classList.contains('system')).toBe(true);
  });
});

describe('Onboarding Guide Modal', () => {
  it('should show onboarding and dismiss on finish/skip click', () => {
    localStorage.removeItem('stadiumos-onboarded');
    render(<OnboardingGuide />);
    
    // Check first step welcome title
    expect(screen.getByText('Welcome to StadiumOS AI')).toBeInTheDocument();
    
    // Click Skip Guide button
    const skipBtn = screen.getByRole('button', { name: /Skip Guide/i });
    fireEvent.click(skipBtn);
    
    // Onboarding guide should set complete in localStorage
    expect(localStorage.getItem('stadiumos-onboarded')).toBe('true');
  });
});

describe('InfoTooltip Component', () => {
  it('should display tooltip content on button focus/hover', async () => {
    render(<InfoTooltip content="Test help content" label="Incidents Info" />);
    
    const trigger = screen.getByRole('button', { name: /Incidents Info/i });
    expect(trigger).toBeInTheDocument();
    
    // Hover/Focus triggers state update
    fireEvent.focus(trigger);
    
    expect(screen.getByText('Test help content')).toBeInTheDocument();
  });
});
