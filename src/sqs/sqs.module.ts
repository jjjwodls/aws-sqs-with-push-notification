import { Module } from '@nestjs/common';
import { SQS_CLIENT } from 'src/provide';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';
import { SqsClient } from './sqs-client';
import { SqsService } from './sqs.service';

@Module({
  imports: [PushNotificationModule],
  providers: [SqsService, {
    provide: SQS_CLIENT,
    useClass: SqsClient,
  }],
  exports: [SqsService],
})
export class SqsModule {}
