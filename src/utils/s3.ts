import { AwsClient } from 'aws4fetch';
import { randomUUID } from 'crypto';

type BucketPaths = 'images';

export const initS3Client = () => {
  const s3 = new AwsClient({
    accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
    service: 's3',
  });

  return s3;
};

export const getPublicUrlForS3Object = (
  tenant: string,
  bucketPath: BucketPaths,
  fileName: string,
) => {
  const path = `${tenant}/${bucketPath}/${fileName}`;

  return {
    url: `${process.env.S3_BUCKET_PUBLIC_ENDPOINT}/${path}`,
    path: `${path}`,
    endpoint: process.env.S3_BUCKET_PUBLIC_ENDPOINT,
  };
};

export const uploadFileToBucket = async (
  s3Client: AwsClient,
  tenant: string,
  bucketPath: BucketPaths,
  file: Express.Multer.File,
) => {
  const fileUuid = randomUUID();
  const fileExtension = file.originalname.split('.')[1];
  const fileName = `${fileUuid}.${fileExtension}`;

  const filePath = `${tenant}/${bucketPath}/${fileName}`;

  const response = await s3Client.fetch(
    `${process.env.S3_BUCKET_ENDPOINT}/${filePath}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': file.mimetype,
      },
      body: file.buffer,
    },
  );

  return {
    response,
    tenant,
    bucketPath,
    fileName,
  };
};

export const deleteFileFromBucket = async (
  s3Client: AwsClient,
  path: string,
) => {
  const response = await s3Client.fetch(
    `${process.env.S3_BUCKET_ENDPOINT}/${path}`,
    {
      method: 'DELETE',
    },
  );

  return response;
};
