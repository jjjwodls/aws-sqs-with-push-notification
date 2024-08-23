import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SqsService } from './sqs/sqs.service';

@Injectable()
export class BatchService {
  constructor(private readonly sqsService: SqsService) {}

  @Cron(CronExpression.EVERY_30_SECONDS) // 매 분마다 메시지를 가져옴
  async handleCron() {
    await this.sqsService.pollMessagesAndSendPushNotification();
  }
}
