import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'expense tracker';
  }

  @Get('about')
  getAbout() {
    return {
      name: 'fateme',
      age: 20,
    };

    // return 'fateme';
  }
}
