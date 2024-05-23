import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrainService } from './train.service';

@Injectable()
export class CronjobsService {
  private readonly logger = new Logger(CronjobsService.name);
  constructor(private readonly trainService: TrainService) {}

  @Cron('0 * * * * *')
  onStart() {
    this.logger.log('Entry CronJobs Service starting...');
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async trainData() {
    this.logger.log('Training data...');
    this.trainService.trainModel();
  }
}
