import { BadRequestException } from '@nestjs/common';

export class InvalidMessageBodyException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
