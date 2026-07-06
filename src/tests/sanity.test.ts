import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../utils/security';

describe('Sanity Check', () => {
  it('should sanitize input and strip HTML tags', () => {
    const rawInput = '<script>alert("hello")</script>  test  ';
    const cleanInput = sanitizeInput(rawInput);
    // sanitizeInput strips HTML tags and HTML-encodes special chars
    expect(cleanInput).not.toContain('<script>');
    expect(cleanInput).toContain('test');
  });
});
