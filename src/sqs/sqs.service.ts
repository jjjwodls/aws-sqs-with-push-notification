import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { SQS_CLIENT } from 'src/provide';
import { PushMessagePayload } from 'src/push-notification/push-message-payload';
import { PushNotificationService } from './../push-notification/push-notification.service';
import { InvalidMessageBodyException } from './invalid-message-body-exception';
import { SqsClientInterface } from './sqs-client.interface';

@Injectable()
export class SqsService {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
    @Inject(SQS_CLIENT) private readonly sqsClient: SqsClientInterface,
  ) {
  }

  async pollMessagesAndSendPushNotification() {
    try {
      const messages = await this.sqsClient.requestSqsMessage();
      if (messages) {
        for (const message of messages) {
          const pushMessageTemplate = JSON.parse(message.Body) as PushMessagePayload;
          this.pushNotificationService.sendPushMessage(
            pushMessageTemplate.token,
            pushMessageTemplate.title,
            pushMessageTemplate.body,
          );
          await this.sqsClient.deleteMessage(message.ReceiptHandle);
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new InvalidMessageBodyException(error.message);
      }
      throw error;
    }
  }
}
