import { Module } from '@nestjs/common';
import { ExpoProvider } from 'src/expo/expo-provider';
import { PushNotificationService } from './push-notification.service';

@Module({
  providers: [ExpoProvider, PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
