import type { AIResponse } from '../types';

export class FallbackAI {
  async handleFailure(error: Error): Promise<AIResponse> {
    console.warn('FallbackAI: Gemini API failed, using fallback logic. Error details:', error.message);
    return this.getGeneralFallback();
  }

  getScenarioFallback(scenarioId: string): AIResponse {
    const offlineHeader = "[Offline Stadium Intelligence Active] ";
    
    switch (scenarioId) {
      case 'scen-surge-emergency':
        return {
          content: `${offlineHeader}Immediate crowd buffering protocol required at Gate G Outer Perimeter. Gate G ticket scanners should be throttled to 50% capacity. Open auxiliary Gate F and Gate H to absorb redirected fans.`,
          source: 'OFFLINE_INTELLIGENCE',
          confidence: 'high',
          citations: [
            { source: "stadium_sop.json", section: "SOP-01", id: "sop-crowd-surge" }
          ],
          actions: [
            "Activate electronic detour signage at Transit Drop-off directing fans to Gates F and H.",
            "Deploy volunteer team to set up serpentine barricades 50m from Gate G.",
            "Alert security command to assist with queue calming."
          ],
          metadata: {
            priority: 'critical',
            suggestedTasks: [
              {
                roleRequired: "Usher",
                assignedCount: 6,
                location: "Gate G Outer Perimeter",
                description: "Manually deploy serpentine barriers and direct spectators to auxiliary Gates F & H."
              },
              {
                roleRequired: "Guest Ambassador",
                assignedCount: 4,
                location: "Transit Center Crossing",
                description: "Hold flags and guide newly arriving spectators away from Gate G lanes."
              }
            ],
            requiredToolCalls: [
              {
                name: "setGateStatus",
                arguments: { gateId: "Gate-G", isOpen: true, activeLaneCount: 4 }
              },
              {
                name: "triggerDetourSigns",
                arguments: { targetGates: ["Gate-F", "Gate-H"], message: "Gate G Congestion: Route to F/H" }
              }
            ]
          }
        };

      case 'scen-lost-fan':
        return {
          content: `${offlineHeader}Provide Japanese translation support and escort spectator to Section 112 (near Sector B, Row 12, Seat 4). Check ticket details using the hand-held scanner.`,
          source: 'OFFLINE_INTELLIGENCE',
          confidence: 'high',
          citations: [
            { source: "volunteer_manual.json", section: "VOL-05", id: "vol-multilingual" }
          ],
          actions: [
            "Use the StadiumOS handheld translation tool to explain directions in Japanese.",
            "Locate and dispatch a Japanese-speaking Guest Ambassador.",
            "Escort fan safely to Sector B, Section 112, Row 12."
          ],
          metadata: {
            priority: 'low',
            suggestedTasks: [
              {
                roleRequired: "Guest Ambassador",
                assignedCount: 1,
                location: "North Concourse Info Desk",
                description: "Use translation app to guide Japanese-speaking fan to their seat in Sector B."
              }
            ],
            requiredToolCalls: []
          }
        };

      case 'scen-accessibility-request':
        return {
          content: `${offlineHeader}Dispatch a golf cart shuttle to transport the visitor from the Light Rail Station ADA gate to Sector C. Route them via ADA Elevator 4 to access Sector C Section 104 companion platforms.`,
          source: 'OFFLINE_INTELLIGENCE',
          confidence: 'high',
          citations: [
            { source: "accessibility_rules.json", section: "ACC-01", id: "acc-wheelchair" },
            { source: "accessibility_rules.json", section: "ACC-03", id: "acc-elderly" }
          ],
          actions: [
            "Deploy ADA shuttle vehicle to Light Rail Station Gate.",
            "Provide wheelchair companion seating validation at Sector C check-in.",
            "Verify Elevator 4 is operational and clear of general queues."
          ],
          metadata: {
            priority: 'medium',
            suggestedTasks: [
              {
                roleRequired: "Guest Ambassador",
                assignedCount: 1,
                location: "Light Rail Station ADA Gate",
                description: "Meet elderly visitor with wheelchair and golf cart shuttle."
              },
              {
                roleRequired: "Usher",
                assignedCount: 1,
                location: "Elevator 4 Lobby",
                description: "Maintain elevator priority check for ADA guests."
              }
            ],
            requiredToolCalls: [
              {
                name: "dispatchShuttle",
                arguments: { vehicleId: "ADA-Cart-2", start: "Light Rail Gate", destination: "Sector-C" }
              }
            ]
          }
        };

      case 'scen-maintenance-incident':
        return {
          content: `${offlineHeader}Deploy a clean-up team to Sector C Concourse Corridor C-3 immediately to clear the water spill and install 'Wet Floor' caution signs. Redirect wheelchair traffic away from Corridor C-3.`,
          source: 'OFFLINE_INTELLIGENCE',
          confidence: 'high',
          citations: [
            { source: "emergency_protocols.json", section: "EM-02", id: "em-blocked-exit" },
            { source: "volunteer_manual.json", section: "VOL-02", id: "vol-incident" }
          ],
          actions: [
            "Dispatch facilities cleaning crew with wet vacs and warning cones.",
            "Ushers to cross arms and divert wheelchair users to the parallel ramp bypass.",
            "Confirm spill is cleaned and clear route within 15 minutes."
          ],
          metadata: {
            priority: 'high',
            suggestedTasks: [
              {
                roleRequired: "Usher",
                assignedCount: 2,
                location: "Concourse Corridor C-3",
                description: "Set up detour sign and direct wheelchair users to the bypass route."
              }
            ],
            requiredToolCalls: [
              {
                name: "dispatchMaintenance",
                arguments: { type: "spill-cleanup", location: "Corridor C-3", priority: "high" }
              }
            ]
          }
        };

      case 'scen-sustainability-optimization':
        return {
          content: `${offlineHeader}Deploy additional volunteers at Food Court 3 to act as recycling monitors and explain proper disposal rules. Conduct a brief swap of garbage bins for dual-sorting bins.`,
          source: 'OFFLINE_INTELLIGENCE',
          confidence: 'high',
          citations: [
            { source: "volunteer_manual.json", section: "VOL-01", id: "vol-roles" }
          ],
          actions: [
            "Post Guest Ambassadors at Food Court 3 waste areas to guide sorting.",
            "Display zero-waste infographics on Food Court LED panels.",
            "Log waste contamination metrics for post-match review."
          ],
          metadata: {
            priority: 'medium',
            suggestedTasks: [
              {
                roleRequired: "Guest Ambassador",
                assignedCount: 2,
                location: "Food Court 3 Plaza",
                description: "Act as Zero-Waste guides and help fans sort recycling materials."
              }
            ],
            requiredToolCalls: []
          }
        };

      default:
        return this.getGeneralFallback();
    }
  }

  private getGeneralFallback(): AIResponse {
    return {
      content: "[Offline Stadium Intelligence Active] System operational in standard fallback mode. Monitor crowd density, volunteer shifts, and incident queues via the operator dashboard.",
      source: 'OFFLINE_INTELLIGENCE',
      confidence: 'medium',
      citations: [],
      actions: [
        "Ensure volunteers are active at designated gate stations.",
        "Perform hourly radio status checks across sectors.",
        "Verify emergency protocols are ready for match kickoff."
      ],
      metadata: {
        priority: 'low',
        suggestedTasks: [],
        requiredToolCalls: []
      }
    };
  }
}
