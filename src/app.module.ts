import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchService } from './batch.service';
import { ExpoProvider } from './expo/expo-provider';
import { MessageHandler } from './MessageHandler';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { PushNotificationService } from './push-notification/push-notification.service';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PushNotificationModule,
    SqsModule,
  ],
  providers: [MessageHandler, BatchService, ExpoProvider, PushNotificationService],
})
export class AppModule {}
