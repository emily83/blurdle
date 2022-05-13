const S3_BUCKET = process.env.S3_BUCKET;

const aws = require('aws-sdk');
const path = require('path');

// @desc    Get signed url for S3 put
// @route   GET /api/v1/aws/sign-s3-put
// @access  Public
exports.signS3Put = async (req, res, next) => {
    try {
        aws.config.region = 'eu-west-1';
        const s3 = new aws.S3();
        const fileName = Date.now() + '.jpg';
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: 60,
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };

        s3.getSignedUrl('putObject', s3Params, (err, url) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    url,
                    fileName
                }
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
 }