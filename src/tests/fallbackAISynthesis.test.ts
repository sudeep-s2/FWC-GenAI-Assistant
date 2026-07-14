import { describe, it, expect } from 'vitest';
import { FallbackAI } from '../services/fallbackAI';
import type { KnowledgeDocument } from '../types';

describe('FallbackAI RAG synthesis engine', () => {
  const fallback = new FallbackAI();

  const mockDocs: KnowledgeDocument[] = [
    {
      id: 'doc-1',
      title: 'Emergency Evacuation Protocols',
      category: 'Emergency Protocols',
      section: 'SOP-03',
      content: 'In emergency fire or blocked gate events, volunteers must clear access lanes.',
      priority: 'critical',
      tags: ['emergency', 'evacuation', 'fire'],
      lastUpdated: '2026-07-06'
    },
    {
      id: 'doc-2',
      title: 'Gate G Ingress Serpentine Barriers',
      category: 'Crowd Management',
      section: 'SOP-01',
      content: 'Ushers should deploy Gate G serpentine blocks when crowd levels reach critical.',
      priority: 'high',
      tags: ['crowd', 'surge', 'gate-g', 'barriers'],
      lastUpdated: '2026-07-06'
    }
  ];

  it('should calculate proper relevance scores and rank documents', () => {
    // Querying with keywords targeting doc-2
    const result = fallback.synthesizeResponseFromRAG(
      'critical crowd barriers Gate G',
      mockDocs,
      'PRE_MATCH',
      'Organizer'
    );

    expect(result.source).toBe('OFFLINE_INTELLIGENCE');
    expect(result.confidence).toBe('high'); // Critical/High priority docs boost confidence to high
    expect(result.content).toContain('Gate G Ingress Serpentine Barriers'); // Doc 2 should be ranked higher due to keyword overlaps
    expect(result.actions).toContain('[Crowd Control] Deploy barriers and restrict entry lanes near SOP-01.');
  });

  it('should synthesize appropriate priority level based on max document priority', () => {
    const result = fallback.synthesizeResponseFromRAG(
      'emergency evacuation fire',
      mockDocs,
      'ENTRY',
      'Volunteer'
    );

    expect(result.metadata.priority).toBe('critical'); // doc-1 is critical
    expect(result.citations[0].source).toBe('emergency_protocols.json'); // Safety maps to emergency_protocols.json
  });

  it('should fall back to general response when document list is empty', () => {
    const result = fallback.synthesizeResponseFromRAG(
      'unknown random term',
      [],
      'HALFTIME',
      'Fan'
    );

    expect(result.content).toContain('Offline Stadium Intelligence Active');
    expect(result.citations).toHaveLength(0);
  });

  it('should return deterministic emergency guidelines for medical queries', () => {
    const result = fallback.getDeterministicEmergencyGuidance('medical assistance needed in Sector B', 'HALFTIME', 'Volunteer');
    expect(result.content).toContain('Offline Emergency Rules Mode');
    expect(result.content).toContain('Medical Standby active');
    expect(result.metadata.priority).toBe('critical');
    expect(result.actions).toContain('Notify Sector Command on Radio Channel 3.');
  });

  it('should return default deterministic guidelines for generic queries', () => {
    const result = fallback.getDeterministicEmergencyGuidance('other random query', 'POST_MATCH', 'Fan');
    expect(result.content).toContain('Standard advisory active');
    expect(result.metadata.priority).toBe('low');
  });
});
