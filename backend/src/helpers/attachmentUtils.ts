import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

// fileStogare logic implementation - no logger

export class AttachmentUtils {
  static bucketName = process.env.ATTACHMENT_S3_BUCKET

  constructor(
    private readonly s3Client = createS3Client(),
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async getUploadUrl(imageId: string) {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: AttachmentUtils.bucketName,
      Key: imageId,
      Expires: this.urlExpiration
    })
  }
}

function createS3Client() {
  if (process.env.IS_OFFLINE) {
    return new XAWS.S3.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.S3({
    signatureVersion: 'v4'
  })
}
