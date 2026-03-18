import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@gitroom/nestjs-libraries/database/prisma/database.module';
import { ApiModule } from '@gitroom/backend/api/api.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from '@gitroom/backend/services/auth/permissions/permissions.guard';
import { PublicApiModule } from '@gitroom/backend/public-api/public.api.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { FILTER } from '@gitroom/nestjs-libraries/sentry/sentry.exception';
import { BackgroundSchedulerService } from '@gitroom/nestjs-libraries/background/background.service';

const heavyFeaturesEnabled = process.env.POSTIZ_ENABLE_HEAVY_FEATURES === 'true';

const heavyImports = heavyFeaturesEnabled
  ? [
      require('@gitroom/nestjs-libraries/agent/agent.module').AgentModule,
      require('@gitroom/nestjs-libraries/3rdparties/thirdparty.module')
        .ThirdPartyModule,
      require('@gitroom/nestjs-libraries/videos/video.module').VideoModule,
      require('@gitroom/nestjs-libraries/chat/chat.module').ChatModule,
    ]
  : [];

@Global()
@Module({
  imports: [
    SentryModule.forRoot(),
    DatabaseModule,
    ApiModule,
    PublicApiModule,
    ...heavyImports,
  ],
  controllers: [],
  providers: [
    FILTER,
    BackgroundSchedulerService,
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [
    DatabaseModule,
    ApiModule,
    PublicApiModule,
  ],
})
export class AppModule {}
