import {
  DeleteMessageCommand,
  DeleteMessageCommandOutput,
  Message,
  ReceiveMessageCommand,
  ReceiveMessageCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { SqsClientInterface } from './sqs-client.interface';

@Injectable()
export class SqsClient implements SqsClientInterface {
  private sqsClient: SQSClient;
  private queueUrl: string = process.env.QUEUE_URL;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }

  async requestSqsMessage(): Promise<Message[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10, // 한 번에 가져올 메시지 수
      WaitTimeSeconds: 20, // long polling 대기 시간
      VisibilityTimeout: 15, // 재시도 하는 시간이다.
      MessageSystemAttributeNames: [
        'All',
      ],
    });
    const response = await this.sqsClient.send(command);

    return response.Messages;
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
    } catch (error) {
    }
  }
}
