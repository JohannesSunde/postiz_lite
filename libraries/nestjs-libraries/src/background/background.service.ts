import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { AutopostService } from '@gitroom/nestjs-libraries/database/prisma/autopost/autopost.service';

@Injectable()
export class BackgroundSchedulerService
  implements OnModuleInit, OnModuleDestroy
{
  private timers: NodeJS.Timeout[] = [];

  constructor(
    private _postsService: PostsService,
    private _integrationService: IntegrationService,
    private _autopostService: AutopostService
  ) {}

  onModuleInit() {
    this.startTimer(() => this.processDuePosts(), 60_000);
    this.startTimer(() => this.refreshTokens(), 15 * 60_000);
    this.startTimer(() => this.runAutoposts(), 15 * 60_000);

    void this.processDuePosts().catch(() => undefined);
    void this.refreshTokens().catch(() => undefined);
    void this.runAutoposts().catch(() => undefined);
  }

  onModuleDestroy() {
    for (const timer of this.timers) {
      clearInterval(timer);
    }
  }

  private startTimer(fn: () => Promise<void>, interval: number) {
    const timer = setInterval(() => {
      void fn().catch(() => undefined);
    }, interval);

    this.timers.push(timer);
    return timer;
  }

  async processDuePosts() {
    const duePosts = await this._postsService.getDuePosts();
    for (const post of duePosts) {
      try {
        await this._postsService.runPostWorkflow(
          post.id,
          post.organizationId,
          false
        );
      } catch (err) {
        /** keep polling */
      }
    }
  }

  async refreshTokens() {
    await this._integrationService.refreshTokens();
  }

  async runAutoposts() {
    await this._autopostService.runActiveAutoposts();
  }
}
