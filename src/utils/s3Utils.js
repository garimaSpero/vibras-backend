// s3Utils.js

const AWS = require('aws-sdk');
const fs = require('fs');
const crypto = require('crypto');

// Set the region and access key ID/secret access key for the AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create an instance of the S3 service
const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET

function deleteS3Object(url) {
    const segments = url.split('/');
  
    const objectName = segments[segments.length - 1];
    const folderName = segments.length === 5 ? segments[segments.length - 2] : '';
    console.log(objectName, folderName);
    // Set the parameters for the delete operation
    const deleteParams = {
        Bucket: bucketName,
        Key: folderName ? `${folderName}/${objectName}` : objectName
    };

    // Call the deleteObject method to delete the object
    s3.deleteObject(deleteParams, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Object ${objectName} deleted from bucket ${bucketName}`);
        }
    });
}


async function uploadPdf(buffer) {
    const timestamp = new Date().getTime();
    const randomString = crypto.randomBytes(4).toString('hex');
    const filename = 'pdf/' + `${timestamp}-${randomString}.pdf`;

    const params = {
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ACL: 'public-read',
        ContentType: 'application/pdf',
        ContentDisposition: 'inline'
    };

    try {
        const data = await s3.upload(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function uploadImage(base64Image) {
    const timestamp = new Date().getTime();
    const randomString = crypto.randomBytes(4).toString('hex');
    const segments = base64Image.split(',');

    const imageBuffer = Buffer.from(segments[1], 'base64');
    const fileName = `${timestamp}-${randomString}.png`;

    // Set up the S3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: imageBuffer,
        ACL: 'public-read', // Set appropriate access permissions
        ContentType: 'image/png', // Set the content type to 'image/png' for PNG images
        ContentDisposition: 'inline'
    };

    try {
        // Upload the image to S3
        const uploadResult = await s3.upload(params).promise();
        console.log('Image uploaded successfully:', uploadResult.Location);
        return uploadResult.Location;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

module.exports = {
    deleteS3Object,
    uploadPdf,
    uploadImage
};
