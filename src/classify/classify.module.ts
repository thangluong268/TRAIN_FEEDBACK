import { Module } from '@nestjs/common';
import { ClassifyController } from './classify.controller';
import { ClassifyService } from './classify.service';

@Module({
  imports: [],
  controllers: [ClassifyController],
  providers: [ClassifyService],
  exports: [ClassifyService],
})
export class ClassifyModule {}
