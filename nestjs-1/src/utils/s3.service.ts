import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { GetObjectOutput } from 'aws-sdk/clients/s3';

@Injectable()
export class S3Service {
  private createS3Client(): AWS.S3 {
    return new AWS.S3({
      credentials: {
        accessKeyId: 'mock',
        secretAccessKey: 'mock',
      },
      region: 'eu-central-1',
      endpoint: 'http://localhost:4572',
      s3ForcePathStyle: true,
    });
  }

  private get params() {
    return { Bucket: 'local-nestjs-bucket' };
  }

  public async getObject(fileName: string): Promise<GetObjectOutput> {
    return new Promise<GetObjectOutput>((resolve, reject) => {
      const s3 = this.createS3Client();
      s3.getObject(
        {
          ...this.params,
          Key: fileName,
        },
        (err, data) => {
          if (err != null) {
            reject(err);
            return;
          }
          resolve(data);
        },
      );
    });
  }

  public async generateSignedUrl(fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const s3 = this.createS3Client();
      s3.getSignedUrl(
        'getObject',
        {
          ...this.params,
          Key: fileName,
          Expires: 60 * 60 * 24,
        },
        (err, url) => {
          if (err != null) {
            reject(err);
            return;
          }

          resolve(url);
        },
      );
    });
  }

  public async upload(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    await new Promise<void>((resolve, reject) => {
      const s3 = this.createS3Client();
      s3.putObject(
        {
          ...this.params,
          Key: fileName,
          Body: buffer,
          ContentType: mimeType,
        },
        (err, data) => {
          if (err != null) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
    const url = await this.generateSignedUrl(fileName);
    return url;
  }

  public async delete(fileName: string): Promise<void> {
    const s3 = this.createS3Client();

    return new Promise<void>((resolve, reject) => {
      s3.deleteObject(
        {
          ...this.params,
          Key: fileName,
        },
        (err, data) => {
          if (err != null) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }
}
