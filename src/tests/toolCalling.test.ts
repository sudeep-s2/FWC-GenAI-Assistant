import { describe, it, expect } from 'vitest';
import { ToolCalling } from '../services/toolCalling';

describe('ToolCalling engine validation', () => {
  it('should validate and execute valid tool calls successfully', async () => {
    const caller = new ToolCalling();

    const dispatchVol = await caller.executeTool({
      name: 'dispatchVolunteer',
      arguments: {
        roleRequired: 'Usher',
        location: 'Gate G Outer Perimeter',
        count: 5
      }
    });

    expect(dispatchVol.success).toBe(true);
    expect(dispatchVol.message).toContain('Dispatched 5 volunteer(s)');

    const maintenanceCall = await caller.executeTool({
      name: 'dispatchMaintenance',
      arguments: {
        location: 'Corridor C-3',
        issue: 'Liquid spill',
        priority: 'high'
      }
    });

    expect(maintenanceCall.success).toBe(true);
    expect(maintenanceCall.message).toContain('Dispatched maintenance crew');
  });

  it('should reject unknown tool calls', async () => {
    const caller = new ToolCalling();

    const result = await caller.executeTool({
      name: 'nonExistentTool',
      arguments: {}
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Unknown tool');
  });

  it('should validate parameters and reject invalid tool configurations', async () => {
    const caller = new ToolCalling();

    const invalidMaintenance = await caller.executeTool({
      name: 'dispatchMaintenance',
      arguments: {
        issue: 'Power failure'
      }
    });

    expect(invalidMaintenance.success).toBe(false);
    expect(invalidMaintenance.message).toContain('requires location');

    const invalidReroute = await caller.executeTool({
      name: 'rerouteCrowd',
      arguments: {
        gateId: 'Gate-G'
      }
    });

    expect(invalidReroute.success).toBe(false);
    expect(invalidReroute.message).toContain('requires gateId');
  });
});
