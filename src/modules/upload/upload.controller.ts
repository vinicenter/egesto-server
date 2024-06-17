import {
  Body,
  Controller,
  Delete,
  Headers,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { tenantIdentifier } from 'src/constants/general';
import { UploadDeleteDto } from './dto/upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/')
  @UseInterceptors(FilesInterceptor('file'))
  upload(
    @Headers() headers: Record<string, string>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ files: string[] }> {
    const tenant = headers[tenantIdentifier];

    return this.uploadService.upload(tenant, files);
  }

  @Delete('/')
  delete(
    @Headers() headers: Record<string, string>,
    @Body() data: UploadDeleteDto,
  ): Promise<{ message: string }> {
    const tenant = headers[tenantIdentifier];

    return this.uploadService.delete(tenant, data.files);
  }
}
