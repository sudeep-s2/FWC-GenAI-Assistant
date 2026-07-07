// Configuration Types
export interface GeminiConfig {
  apiKey: string;
  modelName: string;
  temperature: number;
}

// Knowledge Base Types
export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  section: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  lastUpdated: string;
}

// Gate Status Types
export interface GateStatus {
  gateId: string;
  isOpen: boolean;
  flowRatePerHour: number;
  laneCount: number;
  activeLaneCount: number;
  queueTimeMinutes: number;
}

// Crowd Status Types
export interface CrowdStatus {
  areaName: string;
  currentDensity: number; // people per sq meter
  capacityPercentage: number;
  statusLevel: 'normal' | 'warning' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Incident Types
export interface Incident {
  id: string;
  type: 'security' | 'medical' | 'maintenance' | 'accessibility' | 'sustainability';
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'reported' | 'dispatching' | 'resolved';
  timestamp: string;
}

// Volunteer Task Types
export interface VolunteerTask {
  id: string;
  roleRequired: string;
  assignedCount: number;
  location: string;
  description: string;
  status: 'pending' | 'assigned' | 'completed';
}

// Tool Calling Types
export interface ToolCall {
  name: string;
  arguments: Record<string, string | number | boolean | string[]>;
}

// AI Citation Types
export interface AICitation {
  source: string;
  section: string;
  id: string;
}

export type MatchPhase = 'arrival' | 'prep' | 'first-half' | 'half-time' | 'second-half' | 'exit';

// AI Response Types (reusable for Gemini and Fallback)
export interface AIResponse {
  content: string;
  source: 'GEMINI' | 'OFFLINE_INTELLIGENCE';
  confidence: string;
  citations: AICitation[];
  actions: string[];
  factorsConsidered?: string[];
  metadata: {
    priority?: 'low' | 'medium' | 'high' | 'critical';
    suggestedTasks?: Omit<VolunteerTask, 'id' | 'status'>[];
    requiredToolCalls?: ToolCall[];
    [key: string]: unknown;
  };
}

export interface AIStatus {
  geminiAvailable: boolean;
  requestCount: number;
  cacheUsage: number;
  fallbackCount: number;
  ragEnabled: boolean;
  sessionCallsRemaining: number;
}

// Scenario Parameter Types (strictly typed without "any")
export interface ScenarioParameters {
  stadiumArea?: string;
  crowdPercentage?: number;
  riskIndicators?: string[];
  language?: string;
  seatLocation?: string;
  assistanceNeeded?: string;
  accessibilityRequirement?: string;
  currentLocation?: string;
  destination?: string;
  issue?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  energyUsage?: string;
  wasteMetrics?: string;
  transportLoad?: string;
}

// Stadium Demo Scenario Types
export interface StadiumScenario {
  id: string;
  title: string;
  description: string;
  type: 'surge' | 'lost-fan' | 'accessibility' | 'maintenance' | 'sustainability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  parameters: ScenarioParameters;
}

// App State context types
export interface AppState {
  userRole: string;
  geminiStatus: 'idle' | 'loading' | 'success' | 'error';
  events: string[];
  crowdStatus: CrowdStatus[];
  gateStatus: GateStatus[];
  incidents: Incident[];
  tasks: VolunteerTask[];
}
