import type { AIResponse, KnowledgeDocument, MatchPhase, Persona } from '../types';

export class FallbackAI {
  async handleFailure(error: Error): Promise<AIResponse> {
    console.warn('FallbackAI: Gemini API failed, using fallback logic. Error details:', error.message);
    return this.getGeneralFallback();
  }

  synthesizeResponseFromRAG(
    query: string,
    documents: KnowledgeDocument[],
    matchPhase?: MatchPhase,
    activePersona?: Persona
  ): AIResponse {
    const offlineHeader = "[Offline Stadium Intelligence Active] ";
    
    if (documents.length === 0) {
      return this.getGeneralFallback();
    }

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

    // Score and rank documents
    const scoredDocs = documents.map(doc => {
      let score = 0;

      // 1. Keyword matches (+1 per match in title, +1 in content)
      queryWords.forEach(word => {
        if (doc.title.toLowerCase().includes(word)) score += 1;
        if (doc.content.toLowerCase().includes(word)) score += 1;
      });

      // 2. Tag overlap (+2 per matching tag)
      doc.tags.forEach(tag => {
        if (queryLower.includes(tag.toLowerCase())) {
          score += 2;
        }
      });

      // 3. Scenario type / Category match
      const docCategoryLower = doc.category.toLowerCase();
      if (queryLower.includes('wheelchair') || queryLower.includes('ada') || activePersona === 'Accessibility Guest') {
        if (docCategoryLower.includes('accessibility')) score += 5;
      }
      if (queryLower.includes('volunteer') || activePersona === 'Volunteer') {
        if (docCategoryLower.includes('volunteer') || docCategoryLower.includes('logistics')) score += 5;
      }
      if (queryLower.includes('crowd') || queryLower.includes('surge') || queryLower.includes('density') || activePersona === 'Organizer') {
        if (docCategoryLower.includes('crowd') || docCategoryLower.includes('gate')) score += 5;
      }
      if (queryLower.includes('emergency') || queryLower.includes('incident') || queryLower.includes('hazard')) {
        if (docCategoryLower.includes('emergency') || docCategoryLower.includes('safety')) score += 5;
      }

      // 4. Location match (+4 if location name mentioned in query overlaps with doc section/content/tags)
      const locations = ['gate a', 'gate b', 'gate g', 'gate f', 'gate h', 'sector a', 'sector b', 'sector c', 'sector d', 'elevator 3', 'elevator 4', 'lot p4', 'concourse', 'food court'];
      locations.forEach(loc => {
        if (queryLower.includes(loc)) {
          if (doc.content.toLowerCase().includes(loc) || doc.section.toLowerCase().includes(loc) || doc.title.toLowerCase().includes(loc)) {
            score += 4;
          }
        }
      });

      // 5. Severity/Priority boost
      if (doc.priority === 'critical') score += 4;
      else if (doc.priority === 'high') score += 3;
      else if (doc.priority === 'medium') score += 2;
      else if (doc.priority === 'low') score += 1;

      return { doc, score };
    });

    // Sort documents descending by score
    scoredDocs.sort((a, b) => b.score - a.score);
    const topScored = scoredDocs.slice(0, 3); // Take top 3 documents
    const sortedDocs = topScored.map(sd => sd.doc);

    // Determine highest priority among documents
    let maxPriority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const prioritiesOrder = { low: 0, medium: 1, high: 2, critical: 3 };
    for (const doc of sortedDocs) {
      if (prioritiesOrder[doc.priority] > prioritiesOrder[maxPriority]) {
        maxPriority = doc.priority;
      }
    }

    // Synthesize content response
    const documentTitles = sortedDocs.map(d => d.title).join(', ');
    const contentIntro = `Based on offline stadium database records for: ${documentTitles} (Relevance Ranked).`;
    const details = sortedDocs.map(d => `- [${d.section}] ${d.content}`).join('\n');
    const content = `${offlineHeader}${contentIntro}\n\nKey Guidelines:\n${details}\n\nPlease proceed with standard operating procedures under the current match phase (${matchPhase || 'PRE_MATCH'}) and active persona (${activePersona || 'Organizer'}) view.`;

    // Construct actions based on document content/tags
    const actions: string[] = [];
    sortedDocs.forEach(doc => {
      if (doc.tags.includes('crowd') || doc.tags.includes('surge') || doc.tags.includes('buffering')) {
        actions.push(`[Crowd Control] Deploy barriers and restrict entry lanes near ${doc.section}.`);
      }
      if (doc.tags.includes('ada') || doc.tags.includes('accessibility') || doc.tags.includes('wheelchair')) {
        actions.push(`[Accessibility] Clear priority paths and deploy wheelchair shuttle guides to ${doc.section}.`);
      }
      if (doc.tags.includes('volunteer') || doc.tags.includes('volunteers')) {
        actions.push(`[Volunteer Logistics] Coordinate usher shifts and radio updates via ${doc.section} command.`);
      }
      if (doc.tags.includes('emergency') || doc.tags.includes('medical') || doc.tags.includes('hazard')) {
        actions.push(`[Emergency SOP] Deploy first-aid kits/cleaners to ${doc.section} and divert pedestrian streams.`);
      }
    });

    if (actions.length === 0) {
      actions.push("Check stadium sector assignment logs.", "Consult supervisor on Radio Channel 1.");
    }
    const uniqueActions = Array.from(new Set(actions)).slice(0, 4);

    // Collect all factors considered
    const factors = new Set<string>();
    factors.add(`Match phase: ${matchPhase || 'PRE_MATCH'}`);
    factors.add(`Active Persona: ${activePersona || 'Organizer'}`);
    sortedDocs.forEach(doc => {
      doc.tags.forEach(t => factors.add(`SOP Tag: ${t}`));
    });

    // citations mapping
    const citations = sortedDocs.map(doc => {
      const getSourceFile = (category: string): string => {
        switch (category.toLowerCase()) {
          case 'accessibility': return 'accessibility_rules.json';
          case 'volunteer logistics': return 'volunteer_manual.json';
          case 'emergency protocols': return 'emergency_protocols.json';
          default: return 'stadium_sop.json';
        }
      };
      return {
        source: getSourceFile(doc.category),
        section: doc.section,
        id: doc.id
      };
    });

    // Synthesize tasks
    const suggestedTasks = sortedDocs.map(doc => ({
      roleRequired: doc.category.toLowerCase().includes('volunteer') ? 'Usher' : 'Guest Ambassador',
      assignedCount: doc.priority === 'critical' || doc.priority === 'high' ? 3 : 1,
      location: doc.section,
      description: `Address guidelines for ${doc.title}.`
    }));

    return {
      content,
      source: 'OFFLINE_INTELLIGENCE',
      confidence: maxPriority === 'critical' || maxPriority === 'high' ? 'high' : 'medium',
      citations,
      actions: uniqueActions,
      factorsConsidered: Array.from(factors),
      metadata: {
        priority: maxPriority,
        suggestedTasks,
        requiredToolCalls: []
      }
    };
  }

  getScenarioFallback(scenarioId: string): AIResponse {
    const offlineHeader = "[Offline Stadium Intelligence Active] ";
    
    switch (scenarioId) {
      case 'scen-predictive-risk':
        return {
          content: `${offlineHeader}FIFA 2026 Matchday Operations Twin 30-minute crowd prediction indicates high-density load propagation at Gate G Outer Perimeter. Gate G ticket scanners will exceed safe load capacity in approximately 25 minutes. Recommended to throttle scanners to 60% and redirect arrival streams to auxiliary gates.`,
          source: 'OFFLINE_INTELLIGENCE',
          confidence: 'high',
          citations: [
            { source: "stadium_sop.json", section: "SOP-01", id: "sop-crowd-surge" }
          ],
          actions: [
            "Redirection: Set electronic boards to guide incoming fans to Gates F and H.",
            "Pacing: Set transit buffer lanes to hold incoming flows at the light rail exit.",
            "Deploy: Dispatch 4 additional Ushers to set up queuing serpentine blocks."
          ],
          factorsConsidered: [
            "Real-time ticket scanner throughput",
            "FIFA 2026 Matchday arrival velocity schedules",
            "Metro Transit terminal drop-off rate"
          ],
          metadata: {
            priority: 'high',
            currentStatus: 'Gate G outer perimeter capacity is at 92%. Inbound trains are arriving every 3 minutes.',
            predictedIssue: 'Gate G ticket scanner bottleneck may exceed safe queue limits in 25 minutes.',
            estimatedTime: '25 minutes',
            preventionSteps: [
              'Set electronic boards to guide incoming fans to Gates F and H.',
              'Pace shuttle drops and create line queues at the train station exits.',
              'Deploy 4 volunteers to set up serpentine blocks.'
            ],
            suggestedTasks: [
              {
                roleRequired: "Usher",
                assignedCount: 4,
                location: "Gate G Outer Perimeter",
                description: "Deploy queuing serpentine blocks and redirect arrivals to Gates F and H."
              }
            ],
            requiredToolCalls: [
              {
                name: "rerouteCrowd",
                arguments: { gateId: "Gate-G" }
              }
            ]
          }
        };

      case 'scen-surge-emergency':
        return {
          content: `${offlineHeader}Immediate FIFA Matchday crowd buffering protocol required at Gate G Outer Perimeter. Gate G ticket scanners should be throttled to 50% capacity. Open auxiliary Gate F and Gate H to absorb redirected fans.`,
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
          factorsConsidered: [
            "Live gate load cell pressure metrics",
            "FIFA Stadium SOP-01 (Crowd Control)",
            "Match Phase: Pre-match Arrival"
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
          factorsConsidered: [
            "Spectator Preferred Language (Japanese)",
            "FIFA Volunteer Manual VOL-05 (Multilingual)",
            "Ticket Section Validation"
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
          factorsConsidered: [
            "Spectator accessibility requirement",
            "FIFA Elevator priority protocol ACC-01/03",
            "Match Phase: Kickoff Preparation"
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
          factorsConsidered: [
            "Concourse Corridor C-3 wet floor report",
            "FIFA Emergency Protocols (Spills/Hazards)",
            "ADA wheelchair detour accessibility routing"
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
          factorsConsidered: [
            "Zero-waste compliance rules (VOL-01)",
            "Sorting bin contamination levels",
            "Concourse plaza density values"
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

  getDeterministicEmergencyGuidance(
    query: string,
    matchPhase?: MatchPhase,
    activePersona?: Persona
  ): AIResponse {
    const header = "[Offline Emergency Rules Mode] ";
    const queryLower = query.toLowerCase();

    let content = "";
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let actions: string[] = [];
    const factors = [`Match Phase: ${matchPhase || 'PRE_MATCH'}`, `Persona View: ${activePersona || 'Organizer'}`, 'Deterministic Safety SOPs'];

    if (queryLower.includes('medical') || queryLower.includes('injury') || queryLower.includes('hurt') || queryLower.includes('ems')) {
      priority = 'critical';
      content = `${header}Deterministic Emergency Protocol: Medical Standby active. Route patient immediately to Sector A First Aid (Level 1, Room 14), Sector B First Aid (Level 2, Room 32), or Sector D First Aid (Level 1, Room 8). Reserve Elevator 3/4 lobbies for EMS transport and clear spectator paths.`;
      actions = [
        "Notify Sector Command on Radio Channel 3.",
        "Dispatch nearest Mobile EMS Cart to location.",
        "Secure Elevator lobbies and restrict passenger traffic.",
        "Keep patient comfortable; do not move unless in immediate danger."
      ];
    } else if (queryLower.includes('evac') || queryLower.includes('fire') || queryLower.includes('alarm')) {
      priority = 'critical';
      content = `${header}Deterministic Evacuation Protocol: Level 3 Egress active. All gate turnstiles are configured to free-wheel egress. Direct Sectors A/B to Muster Point North (Zone 1); direct Sectors C/D to Muster Point South (Zone 2). Elevators are reserved exclusively for wheelchair/mobility guests.`;
      actions = [
        "Manually open all emergency double-doors.",
        "Guide spectators to assigned Muster Points using flags.",
        "Suspend all inbound transit shuttle bus drop-offs.",
        "Form volunteer guides line at outer perimeters."
      ];
    } else if (queryLower.includes('spill') || queryLower.includes('leak') || queryLower.includes('debris') || queryLower.includes('hazard')) {
      priority = 'high';
      content = `${header}Deterministic Maintenance Protocol: Spill Hazard flagged. Clean up area and place 'Wet Floor' caution signs. If exit ramps or corridors are blocked, ushers must cross arms to signal detour and direct wheelchair traffic via the parallel ramp bypass.`;
      actions = [
        "Dispatch facilities maintenance crew with wet vacs.",
        "Place warning cones 10 meters before the hazard.",
        "Redirect mobility-impaired spectators to auxiliary ramp bypasses.",
        "Report clearance status to Sector Command within 15 minutes."
      ];
    } else if (queryLower.includes('lost') || queryLower.includes('minor') || queryLower.includes('child')) {
      priority = 'medium';
      content = `${header}Deterministic Fan Support Protocol: Spectator Assistance required. Escort lost fans or unaccompanied minors to central resolution desks: North Plaza (Desk 1) or South Plaza (Desk 2). Verify ticket barcodes with backup handheld scanners.`;
      actions = [
        "Escort spectator safely to closest Plaza Info Desk.",
        "Verify credentials and log incident in Guest Services database.",
        "Coordinate supervisor lookup via Radio Channel 4.",
        "Do not leave unaccompanied minors alone."
      ];
    } else {
      priority = 'low';
      content = `${header}Deterministic Operations Protocol: Standard advisory active. Ensure volunteers are staffed at active gates, perimeter checkpoints are clear, and backup handheld scanning devices are charged and ready.`;
      actions = [
        "Conduct sector radio communication check on Channel 1.",
        "Inspect volunteer shift rosters for current match phase.",
        "Ensure ticket queues maintain standard pacing configurations.",
        "Report general status to Sector Supervisor."
      ];
    }

    return {
      content,
      source: 'OFFLINE_INTELLIGENCE',
      confidence: 'medium',
      citations: [],
      actions,
      factorsConsidered: factors,
      metadata: {
        priority,
        suggestedTasks: [
          {
            roleRequired: priority === 'critical' ? 'Security Captain' : 'Usher',
            assignedCount: priority === 'critical' ? 4 : 1,
            location: 'Incident Sector',
            description: `Execute deterministic rules for ${priority} safety protocol.`
          }
        ],
        requiredToolCalls: []
      }
    };
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
