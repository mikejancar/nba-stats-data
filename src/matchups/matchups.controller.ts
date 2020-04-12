import { Controller, Param, Post } from '@nestjs/common';

import { DataRetrievalResponse } from '../models';
import { MatchupsService } from './matchups.service';

@Controller('matchups')
export class MatchupsController {
  constructor(private matchupsService: MatchupsService) {}

  @Post(':scheduleDate')
  async getMatchups(@Param('scheduleDate') scheduleDate: string): Promise<DataRetrievalResponse> {
    return await this.matchupsService.getMatchups(scheduleDate);
  }
}
