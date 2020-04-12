import { Injectable } from '@nestjs/common';

import { FormattingService } from '../formatting/formatting.service';
import { DataRetrievalResponse, DataSources } from '../models';
import { NetworkService } from '../network/network.service';

@Injectable()
export class BoxScoresService {
  constructor(private formattingService: FormattingService, private networkService: NetworkService) {}

  async getBoxScoresOn(datePlayed: string): Promise<DataRetrievalResponse> {
    const dateFormatted = this.formattingService.formatDateForStatsCall(datePlayed);
    const url = `https://stats.nba.com/stats/leaguegamelog?Counter=1000&DateFrom=${dateFormatted}&DateTo=${dateFormatted}&Direction=DESC&LeagueID=00&PlayerOrTeam=T&Season=2019-20&SeasonType=Regular+Season&Sorter=DATE`;

    try {
      const response = await this.networkService.get(url);
      const fileName = this.formattingService.formatDateForFileName(datePlayed);
      const saveResponse = await this.networkService.saveObjectToBucket(DataSources.BoxScores, fileName, JSON.stringify(response));

      if (saveResponse.wasSuccessful) {
        console.log(`Successfully retrieved box scores from ${datePlayed}`);
        return Promise.resolve({ url, wasSuccessful: true });
      } else {
        return Promise.resolve({ url, wasSuccessful: false, errorMessage: saveResponse.errorMessage });
      }
    } catch (error) {
      console.error(`Error getting box scores for ${datePlayed}`, error);
      return Promise.resolve({ url, wasSuccessful: false, errorMessage: JSON.stringify(error) });
    }
  }
}
