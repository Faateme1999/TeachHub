import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('B2_BUCKET_NAME') || '';

    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: `https://${this.configService.get<string>('B2_ENDPOINT')}`,
      credentials: {
        accessKeyId: this.configService.get<string>('B2_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('B2_APPLICATION_KEY') || '',
      },
    });
  }

  async uploadFile(buffer: Buffer, fileName: string, contentType: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: contentType,
        }),
      );

      return fileName;
    } catch (error) {
      console.error('B2 upload error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async deleteFile(fileName: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        }),
      );
    } catch (error) {
      console.error('B2 delete error:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async getFile(fileName: string) {
    try {
      const result = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        }),
      );

      return result.Body as Readable;
    } catch (error) {
      console.error('B2 get file error:', error);
      throw new InternalServerErrorException('Failed to get file');
    }
  }
}
