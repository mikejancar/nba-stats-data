import { Injectable } from '@nestjs/common';

import { FormattingService } from '../formatting/formatting.service';
import { DataRetrievalResponse, DataSources } from '../models';
import { NetworkService } from '../network/network.service';

@Injectable()
export class TeamsService {
  constructor(private formattingService: FormattingService, private networkService: NetworkService) {}

  async getAdvancedTeamStats(upToDate: string): Promise<DataRetrievalResponse> {
    const dateFormatted = this.formattingService.formatDateForStatsCall(upToDate);
    const url = `https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=10/22/2019&DateTo=${dateFormatted}&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Advanced&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2019-20&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=`;

    try {
      const response = await this.networkService.get(url);
      const fileName = this.formattingService.formatDateForFileName(upToDate);
      const saveResponse = await this.networkService.saveObjectToBucket(DataSources.AdvancedTeamStats, fileName, JSON.stringify(response));

      if (saveResponse.wasSuccessful) {
        console.log(`Successfully retrieved advanced team stats up to ${upToDate}`);
        return Promise.resolve({ url, wasSuccessful: true });
      } else {
        return Promise.resolve({ url, wasSuccessful: false, errorMessage: saveResponse.errorMessage });
      }
    } catch (error) {
      console.error(`Failed to retrieve advanced team stats up to ${upToDate}`, error);
      return Promise.resolve({ url, wasSuccessful: false, errorMessage: JSON.stringify(error) });
    }
  }
}
