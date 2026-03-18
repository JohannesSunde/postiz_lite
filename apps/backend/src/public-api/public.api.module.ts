import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from '@gitroom/backend/services/auth/auth.service';
import { PoliciesGuard } from '@gitroom/backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@gitroom/backend/services/auth/permissions/permissions.service';
import { UploadModule } from '@gitroom/nestjs-libraries/upload/upload.module';
import { CodesService } from '@gitroom/nestjs-libraries/services/codes.service';
import { PublicIntegrationsController } from '@gitroom/backend/public-api/routes/v1/public.integrations.controller';
import { PublicAuthMiddleware } from '@gitroom/backend/services/auth/public.auth.middleware';

const heavyFeaturesEnabled = process.env.POSTIZ_ENABLE_HEAVY_FEATURES === 'true';

const authenticatedController = [
  PublicIntegrationsController,
  ...(heavyFeaturesEnabled
    ? [
        require('@gitroom/backend/public-api/routes/v1/public.integrations.video.controller')
          .PublicIntegrationsVideoController,
      ]
    : []),
];
@Module({
  imports: [UploadModule],
  controllers: [...authenticatedController],
  providers: [
    AuthService,
    PoliciesGuard,
    PermissionsService,
    CodesService,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class PublicApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicAuthMiddleware).forRoutes(...authenticatedController);
  }
}
