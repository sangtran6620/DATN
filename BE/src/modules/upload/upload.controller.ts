import {
  Body,
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ApiMultiFiles } from "./decoration/upload.decoration";
import { UploadService } from "./upload.service";

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @ApiConsumes("multipart/form-data")
  @ApiMultiFiles()
  @UseInterceptors(FilesInterceptor("files"))
  @Post("/")
  async uploadMultiFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const uploadApiRes = await this.uploadService.uploadFilesToCloudinary(
      files
    );
    return { urls: uploadApiRes.map((res) => res.secure_url) };
  }

  @Post("/video")
  @ApiConsumes("multipart/form-data")
  @ApiMultiFiles()
  @UseInterceptors(FilesInterceptor("files"))
  async uploadMultiVideos(@UploadedFiles() files: Array<Express.Multer.File>) {
    const uploadApiRes = await this.uploadService.uploadVideos(files);
    return { urls: uploadApiRes.map((res) => res.secure_url) };
  }
}
