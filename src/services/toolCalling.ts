import type { ToolCall } from '../types';

export class ToolCalling {
  private allowedTools = ['dispatchVolunteer', 'dispatchMaintenance', 'rerouteCrowd', 'sendAlert'];

  validateToolCall(toolCall: ToolCall): { valid: boolean; error?: string } {
    if (!this.allowedTools.includes(toolCall.name)) {
      return { valid: false, error: `Unknown tool: ${toolCall.name}` };
    }

    const args = toolCall.arguments;

    switch (toolCall.name) {
      case 'dispatchVolunteer':
        if (typeof args.roleRequired !== 'string' || typeof args.location !== 'string') {
          return { valid: false, error: 'dispatchVolunteer requires roleRequired (string) and location (string) arguments.' };
        }
        break;

      case 'dispatchMaintenance':
        if (typeof args.location !== 'string' || typeof args.issue !== 'string') {
          return { valid: false, error: 'dispatchMaintenance requires location (string) and issue (string) arguments.' };
        }
        break;

      case 'rerouteCrowd':
        if (typeof args.gateId !== 'string' || !Array.isArray(args.targetGates)) {
          return { valid: false, error: 'rerouteCrowd requires gateId (string) and targetGates (string[]) arguments.' };
        }
        break;

      case 'sendAlert':
        if (typeof args.title !== 'string' || typeof args.message !== 'string') {
          return { valid: false, error: 'sendAlert requires title (string) and message (string) arguments.' };
        }
        break;
    }

    return { valid: true };
  }

  async executeTool(toolCall: ToolCall): Promise<{ success: boolean; message: string }> {
    console.log(`ToolCalling: Executing ${toolCall.name} with args:`, toolCall.arguments);
    
    const validation = this.validateToolCall(toolCall);
    if (!validation.valid) {
      return { success: false, message: validation.error || 'Validation failed' };
    }

    const args = toolCall.arguments;

    switch (toolCall.name) {
      case 'dispatchVolunteer':
        const vCount = args.count ? Number(args.count) : 1;
        return {
          success: true,
          message: `Dispatched ${vCount} volunteer(s) with role "${args.roleRequired}" to "${args.location}". Description: "${args.description || 'none'}".`
        };

      case 'dispatchMaintenance':
        return {
          success: true,
          message: `Dispatched maintenance crew to "${args.location}" for issue: "${args.issue}". Priority: "${args.priority || 'medium'}".`
        };

      case 'rerouteCrowd':
        const targets = (args.targetGates as string[]).join(', ');
        return {
          success: true,
          message: `Rerouted crowd flow from "${args.gateId}" to auxiliary gates: [${targets}].`
        };

      case 'sendAlert':
        return {
          success: true,
          message: `Issued stadium alert "${args.title}" (${args.severity || 'info'}): "${args.message}"`
        };

      default:
        return { success: false, message: `Unknown tool: ${toolCall.name}` };
    }
  }
}
