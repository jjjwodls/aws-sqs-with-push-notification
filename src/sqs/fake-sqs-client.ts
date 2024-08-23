import { DeleteMessageCommandOutput, Message, ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
import { SqsClientInterface } from './sqs-client.interface';

export class FakeSqsClient implements SqsClientInterface {
  private queue: Message[] = [];

  async sendSqsMessage(message: Message) {
    this.queue.push(message);
  }

  async requestSqsMessage(): Promise<Message[]> {
    return this.queue;
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    this.queue = this.queue.filter(queue => queue.ReceiptHandle !== receiptHandle);
  }

  getMessages(): Message[] {
    return this.queue;
  }
}
