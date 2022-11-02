'use strict';

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { config } = require('../config');

// s3 설정
const s3Client = new aws.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

const uploadUserImage = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'popprika-test/test',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, `user.${Date.now()}.${file.originalname}`);
    },
  }),
});

module.exports = { uploadUserImage };
