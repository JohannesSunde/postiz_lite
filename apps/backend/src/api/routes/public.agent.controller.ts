import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentGraphInsertService } from '@gitroom/nestjs-libraries/agent/agent.graph.insert.service';

@ApiTags('Public')
@Controller('/public')
export class PublicAgentController {
  constructor(private _agentGraphInsertService: AgentGraphInsertService) {}

  @Post('/agent')
  async createAgent(@Body() body: { text: string; apiKey: string }) {
    if (
      !body.apiKey ||
      !process.env.AGENT_API_KEY ||
      body.apiKey !== process.env.AGENT_API_KEY
    ) {
      return;
    }

    return this._agentGraphInsertService.newPost(body.text);
  }
}
