import { Test, TestingModule } from '@nestjs/testing';
import { NotExpoTokenException } from 'src/expo/not-expo-token-exception';
import { EXPO_SDK } from 'src/provide';
import { FakeExpo } from './fake-expo';
import { PushNotificationService } from './push-notification.service';

describe('PushNotificationService', () => {
  let service: PushNotificationService;
  let fakeExpo: FakeExpo;

  beforeEach(async () => {
    fakeExpo = new FakeExpo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EXPO_SDK,
          useValue: fakeExpo,
        },
        PushNotificationService,
      ],
    }).compile();

    service = module.get<PushNotificationService>(PushNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('유저의 메시지,타이틀, 토큰정보를 통해 expo 푸시서버에 메시지를 전송할 수 있다', async () => {
    const target = 'ExponentPushToken[xxxxxxxxxxxxxx]';
    const title = 'Hello from NestJS! Title';
    const message = 'Hello from NestJS!';

    await service.sendPushMessage(target, title, message);

    const sentNotifications = fakeExpo.getSentNotifications();
    expect(sentNotifications).toHaveLength(1);
    expect(sentNotifications[0].to).toBe(target);
    expect(sentNotifications[0].body).toBe(message);
  });

  it('유저의 메시지, 타이틀, 토큰정보를 통해 푸시를 전송하고 티켓정보를 생성할 수 있다.', async () => {
    const target = 'ExponentPushToken[xxxxxxxxxxxxxx]';
    const title = 'Hello from NestJS! Title';
    const message = 'Hello from NestJS!';

    await service.sendPushMessage(target, title, message);

    const sentTickets = fakeExpo.getSentTickets();
    expect(sentTickets).toHaveLength(1);
    expect(sentTickets[0].status).toBe('ok');
  });

  it('유저의 토큰정보가 잘못된 expo 토큰이여서 푸시서버 메시지 전송에 실패한다.', async () => {
    const target = 'NotExponentPushToken[xxxxxxxxxxxxxx]';
    const title = 'Hello from NestJS! Title';
    const message = 'Hello from NestJS!';
    expect(async () => await service.sendPushMessage(target, title, message)).rejects.toThrow(
      NotExpoTokenException,
    );
  });
});
