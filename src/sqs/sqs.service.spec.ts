import { Test, TestingModule } from '@nestjs/testing';
import { SQS_CLIENT } from 'src/provide';
import { FakeExpo } from 'src/push-notification/fake-expo';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';
import { PushNotificationService } from 'src/push-notification/push-notification.service';
import { FakeSqsClient } from './fake-sqs-client';
import { InvalidMessageBodyException } from './invalid-message-body-exception';
import { SqsService } from './sqs.service';

describe('SqsService', () => {
  let service: SqsService;
  let fakeSqsClient: FakeSqsClient;

  beforeEach(async () => {
    fakeSqsClient = new FakeSqsClient();
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqsService, {
        provide: SQS_CLIENT,
        useValue: fakeSqsClient,
      }, {
        provide: PushNotificationService,
        useFactory: () => {
          return new PushNotificationService(new FakeExpo());
        },
      }],
    }).compile();

    service = module.get<SqsService>(SqsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sqs 에서 메시지를 정상적으로 수신할 수 있다.', async () => {
    fakeSqsClient.sendSqsMessage({
      MessageId: '1',
      ReceiptHandle: 'aaa-1',
      Body: '{"token":"ExponentPushToken[Hr1HQqPORcGmmY_cRnYPA7]","title":"제목","body":"본문"}',
    });

    const messages = await fakeSqsClient.requestSqsMessage();

    expect(messages).toHaveLength(1);
    expect(messages[0].ReceiptHandle).toBe('aaa-1');
  });

  it('메시지에 잘못된 필드가 존재하여 푸시 알림 전송에 실패한다.', async () => {
    fakeSqsClient.sendSqsMessage({
      MessageId: '1',
      ReceiptHandle: 'aaa-1',
      Body:
        '{"token":"ExponentPushToken[Hr1HQqPORcGmmY_cRnYPA7]","title":"제목","body":"본문","invalidField","invalidFieldValue"}',
    });

    expect(async () => await service.pollMessagesAndSendPushNotification()).rejects.toThrow(
      InvalidMessageBodyException,
    );
  });

  it('정상적인 메시지를 통해 푸시알림을 전송하고 메시지를 삭제한다.', async () => {
    fakeSqsClient.sendSqsMessage({
      MessageId: '1',
      ReceiptHandle: 'aaa-1',
      Body: '{"token":"ExponentPushToken[Hr1HQqPORcGmmY_cRnYPA7]","title":"제목","body":"본문"}',
    });

    await service.pollMessagesAndSendPushNotification();

    const queue = fakeSqsClient.getMessages();
    expect(queue).toHaveLength(0);
  });
});
