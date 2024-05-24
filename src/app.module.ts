import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsService } from 'train/cron-job.service';
import { TrainModule } from 'train/train.module';

@Module({
  imports: [TrainModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [CronjobsService],
})
export class AppModule {}
