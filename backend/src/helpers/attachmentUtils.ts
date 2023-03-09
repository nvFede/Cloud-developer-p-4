import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

//import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { createLogger } from '../utils/logger'
const logger = createLogger('AttachmentUtils')

// TODO: Implement the fileStogare logic



export class AttachmentUtils {
  static bucketName = process.env.ATTACHMENT_S3_BUCKET

  constructor(
    private readonly s3Client = createS3Client(),
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async getUploadUrl(imageId: string) {

    logger.info("Getting upload url...")

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
