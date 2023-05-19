const express = require('express');

var aws = require('aws-sdk');
var multer = require('multer');
var sharp = require('sharp');
const fs = require('fs');
var aws = require('aws-sdk');

var s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: "us-east-1"
});


var upload = multer({
    limits: { fileSize: 10 * 1000 * 1000 }, // now allowing user uploads up to 10MB
    fileFilter: function (req, file, callback) {
        let fileExtension = (file.originalname.split('.')[file.originalname.split('.').length - 1]).toLowerCase(); // convert extension to lower case
        if (["png", "jpg", "jpeg"].indexOf(fileExtension) === -1) {
            return callback('Wrong file type', false);
        }
        file.extension = fileExtension.replace(/jpeg/i, 'jpg'); // all jpeg images to end .jpg
        callback(null, true);
    },
    storage: multer.diskStorage({
        destination: '/tmp', // store in local filesystem
        filename: function (req, file, cb) {
            cb(null, `${Date.now().toString()}.${file.extension}`) // user id + date
        }
    })
});

function uploadImage(req, res, next) {
    const originalImage = sharp(req.file.path);
    const resizedImage = sharp(req.file.path);

    Promise.all([
        originalImage.toBuffer(),
        resizedImage.resize({ width: 512 }).toBuffer()
    ]).then(function (buffers) {
        const originalBuffer = buffers[1];
        const resizedBuffer = buffers[0];

        fs.rmSync(req.file.path, { force: true });
        let fieldName = req.file.fieldname.replace(/ /g, '_');
        let originalname = req.file.originalname.replace(/ /g, '_');
        const originalFileName = 'original_' + Date.now() + "_" + fieldName + "_" + originalname;
        const resizedFileName = 'resized_' + Date.now() + "_" + fieldName + "_" + originalname;

        // Upload original image
        let originalUpload = {
            Key: originalFileName,
            Body: originalBuffer,
            Bucket: 'vibras-crm',
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        };
        s3.upload(originalUpload, function (err, response) {
            let originalUrl = response.Location;
            if (err) {
                return res.status(422).send("There was an error uploading the original image to s3: " + err.message);
            }
            // Upload resized image
            let resizedUpload = {
                Key: resizedFileName,
                Body: resizedBuffer,
                Bucket: 'vibras-crm',
                ACL: 'public-read',
                ContentType: req.file.mimetype,
            };
            
            s3.upload(resizedUpload, function (err, response) {
                if (err) {
                    return res.status(422).send("There was an error uploading the resized image to s3: " + err.message);
                } else {
                    
                    req.originalUrl = originalUrl;
                    req.resizedUrl = response.Location.replace(originalFileName, resizedFileName);
                    next();
                }
            });
        });
    })
    .catch(function (err) {
        return res.status(422).send("There was an error processing an image: " + err.message);
    });
}


module.exports = {
    upload,
    uploadImage
    
};
