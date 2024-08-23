import { DeleteMessageCommandOutput, Message, ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';

export interface SqsClientInterface {
  requestSqsMessage(): Promise<Message[]>;
  deleteMessage(receiptHandle: string): Promise<void>;
}
