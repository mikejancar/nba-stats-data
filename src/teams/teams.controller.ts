import { Controller, Param, Post } from '@nestjs/common';

import { DataRetrievalResponse } from '../models';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post('advancedStats/:upToDate')
  async getTeamSplits(@Param('upToDate') upToDate): Promise<DataRetrievalResponse> {
    return this.teamsService.getAdvancedTeamStats(upToDate);
  }
}
