import type { KnowledgeDocument } from '../types';
import stadiumSop from '../knowledge/stadium_sop.json';
import accessibilityRules from '../knowledge/accessibility_rules.json';
import volunteerManual from '../knowledge/volunteer_manual.json';
import emergencyProtocols from '../knowledge/emergency_protocols.json';

export class RAGEngine {
  private knowledgeBase: KnowledgeDocument[] = [];

  constructor() {
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase(): void {
    // Map JSON sources to typed KnowledgeDocuments
    const mapDoc = (doc: unknown): KnowledgeDocument => {
      const d = doc as Record<string, unknown>;
      return {
        id: String(d.id),
        title: String(d.title),
        category: String(d.category),
        section: String(d.section),
        content: String(d.content),
        priority: (d.priority || 'medium') as 'low' | 'medium' | 'high' | 'critical',
        tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
        lastUpdated: String(d.lastUpdated)
      };
    };

    this.knowledgeBase = [
      ...stadiumSop.map(mapDoc),
      ...accessibilityRules.map(mapDoc),
      ...volunteerManual.map(mapDoc),
      ...emergencyProtocols.map(mapDoc)
    ];
  }

  searchRelevantDocuments(query: string, category?: string): KnowledgeDocument[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return [];
    }

    // Split query into keywords
    const keywords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);

    return this.knowledgeBase.filter(doc => {
      // Category filter if specified
      if (category && doc.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      const matchText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();

      // Check if any keyword matches
      const matchesKeyword = keywords.some(keyword => matchText.includes(keyword));
      
      // Also match full phrase
      const matchesPhrase = matchText.includes(normalizedQuery);

      return matchesKeyword || matchesPhrase;
    });
  }

  getContextForPrompt(query: string): {
    documents: KnowledgeDocument[];
    context: string;
    sources: string[];
  } {
    const documents = this.searchRelevantDocuments(query);
    
    const getSourceFile = (category: string): string => {
      switch (category.toLowerCase()) {
        case 'accessibility':
          return 'accessibility_rules.json';
        case 'volunteer logistics':
          return 'volunteer_manual.json';
        case 'emergency protocols':
          return 'emergency_protocols.json';
        default:
          return 'stadium_sop.json';
      }
    };

    const sources = Array.from(new Set(documents.map(doc => getSourceFile(doc.category))));

    const context = documents.map(doc => {
      const sourceFile = getSourceFile(doc.category);
      return `Source: ${sourceFile} | Section: ${doc.section} | ID: ${doc.id} | Title: ${doc.title}\nContent: ${doc.content}`;
    }).join('\n\n');

    return {
      documents,
      context,
      sources
    };
  }
}
