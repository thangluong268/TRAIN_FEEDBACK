import { Body, Controller, Post } from '@nestjs/common';
import { ClassifyService } from './classify.service';

@Controller('classify-feedback')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) {}

  @Post()
  classifyFeedback(@Body() body: { text: string }) {
    return this.classifyService.classifyFeedback(body.text);
  }
}
