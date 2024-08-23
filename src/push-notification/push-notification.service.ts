import { Inject, Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { NotExpoTokenException } from 'src/expo/not-expo-token-exception';
import { EXPO_SDK } from 'src/provide';

@Injectable()
export class PushNotificationService {
  constructor(
    @Inject(EXPO_SDK) private readonly expo: Expo,
  ) {
  }

  async sendPushMessage(pushToken: string, title: string, message: string) {
    this.validatePushToken(pushToken);
    let messages: ExpoPushMessage[] = [];
    messages.push({
      to: pushToken,
      title,
      body: message,
      data: {}, // data 채워넣기
      sound: 'default',
    });

    const chunkPushNotifications = this.expo.chunkPushNotifications(messages);
    for (const chunkPushNotification of chunkPushNotifications) {
      await this.expo.sendPushNotificationsAsync(chunkPushNotification);
    }
  }

  validatePushToken(pushToken: string): void {
    if (!Expo.isExpoPushToken(pushToken)) {
      throw new NotExpoTokenException(`this push token is not expo push token ${pushToken}`);
    }
  }
}
