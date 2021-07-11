const config = require('../../config');
const { MESSAGES } = require('../../utils/common.messages');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fileType = require('file-type');
const { validateFileType } = require('../../utils/common.validation');

const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
})

exports.upload = async (req, res) => {
    try {
        let file = req.file;
        const type = await fileType.fromBuffer(file.buffer);

        if (!validateFileType(type.ext)) {
            return res.status(422).json({
                message: MESSAGES.INVALID_FILE_TYPE
            })
        }

        const params = {
            Bucket: config.aws.s3Bucket,
            Key: `${uuidv4()}.${type.ext}`,
            ContentType: type.mime,
            Body: file.buffer,
            ACL: 'public-read'
        }

        s3.upload(params, (error, data) => {
            if (error) {
                return res.status(500).send({
                    message: error
                })
            }

            res.status(200).send({ data });
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}