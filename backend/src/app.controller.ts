import { Controller, Get } from '@nestjs/common';

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
