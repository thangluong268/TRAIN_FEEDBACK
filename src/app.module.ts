import { Module } from '@nestjs/common';
import { CronjobsService } from 'train/cron-job.service';
import { TrainModule } from 'train/train.module';

@Module({
  imports: [TrainModule],
  controllers: [],
  providers: [CronjobsService],
})
export class AppModule {}
