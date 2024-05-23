import { Body, Controller, Get, Post } from '@nestjs/common';
import { TrainService } from './train.service';

@Controller('train-model-feedback')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Get()
  trainModel() {
    return this.trainService.trainModel();
  }

  @Post()
  classifyFeedback(@Body() body: { newFeedback: string }) {
    return this.trainService.classifyFeedback(body.newFeedback);
  }
}
