import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AgentGraphService } from '@gitroom/nestjs-libraries/agent/agent.graph.service';

@Injectable()
export class AgentRun {
  constructor(private _agentGraphService: AgentGraphService) {}
  @Command({
    command: 'run:agent',
    describe: 'Run the agent',
  })
  async agentRun() {
    const orgId = process.env.POSTIZ_AGENT_ORG_ID;
    if (!orgId) {
      throw new Error('POSTIZ_AGENT_ORG_ID is required to run the agent task');
    }

    console.log(
      await this._agentGraphService.start(orgId, {
        research: process.env.POSTIZ_AGENT_RESEARCH || 'Create a social post',
        isPicture: process.env.POSTIZ_AGENT_IS_PICTURE === 'true',
        format: 'one_short',
        tone: 'company',
      })
    );
  }
}
