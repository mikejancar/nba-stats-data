import { Controller, Param, Post } from '@nestjs/common';

import { DataRetrievalResponse } from '../models';
import { BoxScoresService } from './box-scores.service';

@Controller('boxScores')
export class BoxScoresController {
  constructor(private boxScoresService: BoxScoresService) {}

  @Post('/:datePlayed')
  async getBoxScoresOn(@Param('datePlayed') datePlayed: string): Promise<DataRetrievalResponse> {
    return await this.boxScoresService.getBoxScoresOn(datePlayed);
  }
}
