import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      greeting: '🚀 Welcome to auth api',
    };
  }
}
