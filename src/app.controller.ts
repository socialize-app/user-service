import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern({ cmd: 'sum' })
  accumulate(data: number[]): number {
    console.log('Adding ' + data.toString()); // Don't do this in prod
    return (data || []).reduce((a, b) => a + b);
  }
}
