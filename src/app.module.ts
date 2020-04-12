import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { BoxScoresController } from './box-scores/box-scores.controller';
import { BoxScoresService } from './box-scores/box-scores.service';
import { FormattingService } from './formatting/formatting.service';
import { MatchupsController } from './matchups/matchups.controller';
import { MatchupsService } from './matchups/matchups.service';
import { NetworkService } from './network/network.service';
import { TeamsController } from './teams/teams.controller';
import { TeamsService } from './teams/teams.service';

@Module({
  imports: [],
  controllers: [AppController, BoxScoresController, MatchupsController, TeamsController],
  providers: [BoxScoresService, FormattingService, MatchupsService, NetworkService, TeamsService]
})
export class AppModule {}
