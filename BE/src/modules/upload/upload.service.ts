import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import { Readable } from "typeorm/platform/PlatformTools";

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  async uploadFilesToCloudinary(
    files: Array<Express.Multer.File>
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    return await this.uploadImage(files).catch((e) => {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    });
  }

  async uploadImage(files: Array<Express.Multer.File>) {
    return Promise.all(files.map((file) => this.uploadStream(file)));
  }

  async uploadStream(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        Readable.from(file.buffer).pipe(upload);
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async uploadVideos(
    files: Array<Express.Multer.File>
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    return Promise.all(
      files.map(
        async (file) =>
          await new Promise<UploadApiResponse | UploadApiErrorResponse>(
            (resolve, reject) => {
              v2.uploader
                .upload_stream(
                  { resource_type: "video", image_metadata: true },
                  (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                  }
                )
                .end(file.buffer);
            }
          )
      )
    );
  }

  async uploadFile(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return;
  }

  // async youtubeUrlToMp3(url: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
  //   return new Promise((resolve, reject) => {
  //     const upload = v2.uploader.upload_stream({ resource_type: 'video', image_metadata: true }, (error, result) => {
  //       if (error) return reject(error);
  //       resolve(result);
  //     });
  //     ytdl(url, { filter: 'audioonly' }).pipe(upload);
  //   });
  // }
}
