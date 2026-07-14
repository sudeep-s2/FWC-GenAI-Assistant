import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AccessibilityControlPanel from '../components/shared/AccessibilityControlPanel';

describe('AccessibilityControlPanel Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the floating accessibility button and open the control panel', async () => {
    render(React.createElement(AccessibilityControlPanel));

    const floatingBtn = screen.getByRole('button', { name: /open accessibility controls/i });
    expect(floatingBtn).toBeInTheDocument();

    // Click to open panel
    fireEvent.click(floatingBtn);

    const title = screen.getByRole('heading', { name: /accessibility options/i });
    expect(title).toBeInTheDocument();
  });

  it('should allow toggling Reduced Motion and update localStorage and HTML class list', async () => {
    render(React.createElement(AccessibilityControlPanel));

    // Open panel
    fireEvent.click(screen.getByRole('button', { name: /open accessibility controls/i }));

    const motionToggle = screen.getByRole('switch', { name: /reduced motion/i });
    expect(motionToggle).toBeInTheDocument();
    expect(motionToggle.getAttribute('aria-checked')).toBe('false');

    // Click toggle
    fireEvent.click(motionToggle);

    expect(motionToggle.getAttribute('aria-checked')).toBe('true');
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);

    const saved = JSON.parse(localStorage.getItem('stadiumos_accessibility') || '{}');
    expect(saved.reducedMotion).toBe(true);
  });

  it('should allow selection of font size and inject appropriate CSS classes', async () => {
    render(React.createElement(AccessibilityControlPanel));

    // Open panel
    fireEvent.click(screen.getByRole('button', { name: /open accessibility controls/i }));

    const sizeBtn = screen.getByRole('button', { name: /set font size to extra large/i });
    fireEvent.click(sizeBtn);

    expect(document.documentElement.classList.contains('text-size-xl')).toBe(true);
    const saved = JSON.parse(localStorage.getItem('stadiumos_accessibility') || '{}');
    expect(saved.fontSize).toBe('xl');
  });

  it('should close panel when Esc key is pressed', () => {
    render(React.createElement(AccessibilityControlPanel));

    // Open
    fireEvent.click(screen.getByRole('button', { name: /open accessibility controls/i }));
    expect(screen.getByRole('heading', { name: /accessibility options/i })).toBeInTheDocument();

    // Press escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByRole('heading', { name: /accessibility options/i })).not.toBeInTheDocument();
  });
});
