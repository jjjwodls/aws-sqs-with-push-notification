import { BadRequestException } from '@nestjs/common';

export class NotExpoTokenException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
