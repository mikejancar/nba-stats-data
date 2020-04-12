import { Injectable } from '@nestjs/common';
import aws from 'aws-sdk';
import fetch from 'node-fetch';

import { nbaStatsData } from '../keys/aws.json';
import { DataSources, SaveObjectResponse } from '../models';

@Injectable()
export class NetworkService {
  private standardHeaders = {
    Host: 'stats.nba.com',
    Connection: 'keep-alive',
    Accept: 'application/json, text/plain, */*',
    Referer: 'https://stats.nba.com/teams/boxscores/',
    'x-nba-stats-token': 'true',
    'X-NewRelic-ID': 'VQECWF5UChAHUlNTBwgBVw==',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
    'x-nba-stats-origin': 'stats',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9'
  };
  private bucket = 'nba-stat-data';

  get(url: string): Promise<any> {
    const options = this.createOptions('GET');
    console.log(`GET: ${url}`);
    return fetch(url, options).then(rawResponse => rawResponse.json());
  }

  async saveObjectToBucket(bucket: DataSources, key: string, data: any): Promise<SaveObjectResponse> {
    const s3 = new aws.S3({ accessKeyId: nbaStatsData.id, secretAccessKey: nbaStatsData.key });
    const objectKey = `${bucket}/${bucket}-${key}.json`;
    const params = { Body: data, Bucket: this.bucket, Key: objectKey };

    console.log(`Saving bucket object: ${params.Key}`);
    try {
      await s3.putObject(params).promise();
      return { bucket: this.bucket, objectName: objectKey, wasSuccessful: true };
    } catch (error) {
      console.error(`Error saving ${key} to ${bucket}`, error);
      return { bucket: this.bucket, objectName: objectKey, wasSuccessful: false, errorMessage: JSON.stringify(error) };
    }
  }

  private createOptions(method: string): any {
    return { method, headers: this.standardHeaders };
  }
}
