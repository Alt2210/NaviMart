import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

export type UploadedImage = {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadedImage> {
    this.ensureConfigured();

    const folder =
      this.configService.get<string>('CLOUDINARY_UPLOAD_FOLDER') ??
      'navimart';

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error('Cloudinary did not return an upload result'));
            return;
          }
          resolve(uploadResult);
        },
      );

      stream.end(file.buffer);
    });

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  }

  private ensureConfigured() {
    const missing = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
    ].filter((key) => !this.configService.get<string>(key));

    if (missing.length > 0) {
      throw new InternalServerErrorException(
        `Cloudinary is not configured. Missing: ${missing.join(', ')}`,
      );
    }
  }
}
