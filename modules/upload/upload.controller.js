const config = require('../../config');
const { MESSAGES } = require('../../utils/common.messages');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { validateFile } = require('../../utils/common.validation');

const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
})

exports.upload = async (req, res) => {
    try {
        let myFile = req.file.originalname.split('.');
        const fileType = myFile[myFile.length - 1];
        if(!validateFile) {
            res.status(400).json({
                message: MESSAGES.INVALID_FILE_TYPE
            })    
        }

        const params = {
            Bucket: config.aws.s3Bucket,
            Key: `${uuidv4()}.${fileType}`,
            Body: req.file.buffer,
            ACL: 'public-read'
        }

        s3.upload(params, (error, data) => {
            if(error) {
                res.status(500).send({
                    message: error
                })
            }

            res.status(200).send({data});
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}