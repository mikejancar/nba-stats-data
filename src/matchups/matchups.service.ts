import { Injectable } from '@nestjs/common';

import { FormattingService } from '../formatting/formatting.service';
import { DataRetrievalResponse, DataSources } from '../models';
import { NetworkService } from '../network/network.service';

@Injectable()
export class MatchupsService {
  constructor(private formattingService: FormattingService, private networkService: NetworkService) {}

  async getMatchups(scheduleDate: string): Promise<DataRetrievalResponse> {
    const dateFormatted = this.formattingService.formatDateForStatsCall(scheduleDate);
    const url = `https://stats.nba.com/stats/scoreboardV2?DayOffset=0&LeagueID=00&gameDate=${dateFormatted}`;

    try {
      const response = await this.networkService.get(url);
      const fileName = this.formattingService.formatDateForFileName(scheduleDate);
      const saveResponse = await this.networkService.saveObjectToBucket(DataSources.Matchups, fileName, JSON.stringify(response));

      if (saveResponse.wasSuccessful) {
        console.log(`Successfully retrieved matchups from ${dateFormatted}`);
        return Promise.resolve({ url, wasSuccessful: true });
      } else {
        return Promise.resolve({ url, wasSuccessful: false, errorMessage: saveResponse.errorMessage });
      }
    } catch (error) {
      console.error(`Failed to retrieve matchups from ${dateFormatted}`, error);
      return Promise.resolve({ url, wasSuccessful: false, errorMessage: JSON.stringify(error) });
    }
  }
}
