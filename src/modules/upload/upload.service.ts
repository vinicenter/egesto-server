import { Injectable } from '@nestjs/common';
import { response } from 'express';
import {
  deleteFileFromBucket,
  getPublicUrlForS3Object,
  initS3Client,
  uploadFileToBucket,
} from 'src/utils/s3';

@Injectable()
export class UploadService {
  async upload(
    tenant: string,
    fileUploads: Express.Multer.File[],
  ): Promise<{ files: string[] }> {
    const s3Client = initS3Client();

    const promisses = fileUploads.map((fileUpload) =>
      uploadFileToBucket(s3Client, tenant, 'images', fileUpload),
    );

    const responses = await Promise.all(promisses);

    const publicPaths = responses.map((response) => {
      const publicUrl = getPublicUrlForS3Object(
        response.tenant,
        response.bucketPath,
        response.fileName,
      );

      return publicUrl.url;
    });

    return {
      files: publicPaths,
    };
  }

  async delete(
    tenant: string,
    filesUrl: string[],
  ): Promise<{ message: string }> {
    const s3Client = initS3Client();

    const paths = filesUrl.map((urlString) => {
      const url = new URL(urlString);

      const pathWithoutTenant = url.pathname.split('/').slice(2).join('/');

      return tenant.concat('/', pathWithoutTenant);
    });

    const promisses = paths.map((path) => deleteFileFromBucket(s3Client, path));

    await Promise.all(promisses);

    return {
      message: 'Files deleted',
    };
  }
}
