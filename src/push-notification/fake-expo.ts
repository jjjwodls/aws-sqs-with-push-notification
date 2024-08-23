import { BadRequestException } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

export class FakeExpo extends Expo {
  private notifications: ExpoPushMessage[] = [];
  private tickets: ExpoPushTicket[] = [];

  constructor() {
    super();
  }

  chunkPushNotifications(messages: ExpoPushMessage[]): ExpoPushMessage[][] {
    return [messages];
  }

  async sendPushNotificationsAsync(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
    this.notifications.push(...messages);

    const fakeTickets: ExpoPushTicket[] = messages.map(() => ({
      id: `fake_ticket_${Math.random()}`,
      status: 'ok',
    }));

    this.tickets.push(...fakeTickets);
    return fakeTickets;
  }

  getSentNotifications(): ExpoPushMessage[] {
    return this.notifications;
  }

  getSentTickets(): ExpoPushTicket[] {
    return this.tickets;
  }
}
