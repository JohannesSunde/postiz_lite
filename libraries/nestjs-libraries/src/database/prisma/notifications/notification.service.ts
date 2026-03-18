import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '@gitroom/nestjs-libraries/database/prisma/notifications/notifications.repository';
import { EmailService } from '@gitroom/nestjs-libraries/services/email.service';
import { OrganizationRepository } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository';

export type NotificationType = 'success' | 'fail' | 'info';

type DigestEntry = {
  title: string;
  message: string;
  type: NotificationType;
};

@Injectable()
export class NotificationService {
  private digestQueues = new Map<
    string,
    {
      items: DigestEntry[];
      timer?: NodeJS.Timeout;
    }
  >();

  constructor(
    private _notificationRepository: NotificationsRepository,
    private _emailService: EmailService,
    private _organizationRepository: OrganizationRepository
  ) {}

  getMainPageCount(organizationId: string, userId: string) {
    return this._notificationRepository.getMainPageCount(
      organizationId,
      userId
    );
  }

  getNotificationsPaginated(organizationId: string, page: number) {
    return this._notificationRepository.getNotificationsPaginated(
      organizationId,
      page
    );
  }

  getNotifications(organizationId: string, userId: string) {
    return this._notificationRepository.getNotifications(
      organizationId,
      userId
    );
  }

  async inAppNotification(
    orgId: string,
    subject: string,
    message: string,
    sendEmail = false,
    digest = false,
    type: NotificationType = 'success'
  ) {
    await this._notificationRepository.createNotification(orgId, message);
    if (!sendEmail) {
      return;
    }

    if (digest) {
      this.queueDigest(orgId, { title: subject, message, type });
      return;
    }

    await this.sendEmailsToOrg(orgId, subject, message, type);
  }

  private queueDigest(orgId: string, entry: DigestEntry) {
    const current = this.digestQueues.get(orgId) || { items: [] as DigestEntry[] };
    current.items.push(entry);

    if (!current.timer) {
      current.timer = setTimeout(() => {
        void this.flushDigest(orgId);
      }, 3600000);
    }

    this.digestQueues.set(orgId, current);
  }

  private async flushDigest(orgId: string) {
    const batch = this.digestQueues.get(orgId);
    if (!batch) {
      return;
    }

    if (batch.timer) {
      clearTimeout(batch.timer);
    }

    this.digestQueues.delete(orgId);

    const org = await this._organizationRepository.getAllUsersOrgs(orgId);
    for (const user of org?.users || []) {
      const allowFailure = user.user.sendFailureEmails ? 'fail' : null;
      const allowSuccess = user.user.sendSuccessEmails ? 'success' : null;

      const toSend = batch.items.filter(
        (email) =>
          email.type === allowFailure ||
          email.type === allowSuccess ||
          email.type === 'info'
      );

      if (toSend.length === 0) {
        continue;
      }

      await this.sendEmail(
        user.user.email,
        toSend.length === 1
          ? toSend[0].title
          : `[Postiz] Your latest notifications`,
        toSend.map((p) => p.message).join('<br/>')
      );
    }
  }

  async sendEmailsToOrg(
    orgId: string,
    subject: string,
    message: string,
    type?: NotificationType
  ) {
    const userOrg = await this._organizationRepository.getAllUsersOrgs(orgId);
    for (const user of userOrg?.users || []) {
      // 'info' type is always sent regardless of preferences
      if (type !== 'info') {
        // Filter users based on their email preferences
        if (type === 'success' && !user.user.sendSuccessEmails) {
          continue;
        }
        if (type === 'fail' && !user.user.sendFailureEmails) {
          continue;
        }
      }
      await this.sendEmail(user.user.email, subject, message);
    }
  }

  async sendEmail(to: string, subject: string, html: string, replyTo?: string) {
    await this._emailService.sendEmail(to, subject, html, 'top', replyTo);
  }

  hasEmailProvider() {
    return this._emailService.hasProvider();
  }
}
