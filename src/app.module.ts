import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClassifyModule } from 'classify/classify.module';
import { CronjobsService } from 'train/cron-job.service';
import { TrainModule } from 'train/train.module';

@Module({
  imports: [ScheduleModule.forRoot(), TrainModule, ClassifyModule],
  controllers: [],
  providers: [CronjobsService],
})
export class AppModule {}
