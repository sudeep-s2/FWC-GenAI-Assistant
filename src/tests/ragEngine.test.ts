import { describe, it, expect } from 'vitest';
import { RAGEngine } from '../services/ragEngine';

describe('RAGEngine local retrieval', () => {
  it('should load all four databases and merge them', () => {
    const engine = new RAGEngine();
    const docs = engine.searchRelevantDocuments('Gate G');
    
    expect(docs.length).toBeGreaterThan(0);
    // Verify first loaded document matches the expected format
    expect(docs[0]).toHaveProperty('id');
    expect(docs[0]).toHaveProperty('title');
    expect(docs[0]).toHaveProperty('category');
    expect(docs[0]).toHaveProperty('content');
  });

  it('should retrieve relevant documents based on keywords', () => {
    const engine = new RAGEngine();
    const wheelchairDocs = engine.searchRelevantDocuments('wheelchair');
    
    expect(wheelchairDocs.length).toBeGreaterThan(0);
    expect(wheelchairDocs.every(doc => 
      doc.title.toLowerCase().includes('wheelchair') || 
      doc.content.toLowerCase().includes('wheelchair') ||
      doc.tags.includes('wheelchair')
    )).toBe(true);
  });

  it('should filter search results by category', () => {
    const engine = new RAGEngine();
    const volunteerIncidentDocs = engine.searchRelevantDocuments('incident', 'Volunteer Logistics');
    
    expect(volunteerIncidentDocs.length).toBeGreaterThan(0);
    expect(volunteerIncidentDocs.every(doc => doc.category === 'Volunteer Logistics')).toBe(true);
  });

  it('should provide properly formatted context and source citations', () => {
    const engine = new RAGEngine();
    const result = engine.getContextForPrompt('surge Gate G');
    
    expect(result).toHaveProperty('documents');
    expect(result).toHaveProperty('context');
    expect(result).toHaveProperty('sources');
    
    // Check if context contains citation markers
    expect(result.context).toContain('Source:');
    expect(result.context).toContain('Section:');
    expect(result.context).toContain('ID:');
    
    // Check if it mapped the source file correctly
    expect(result.sources).toContain('stadium_sop.json');
  });
});
