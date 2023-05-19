const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');
require('dotenv').config();

const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: "us-east-1"
})
const s3Storage = multerS3({
    s3: s3,
    bucket: "vibras-crm",

    acl: "public-read",
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname })
    },
    key: (req, file, cb) => {
        let folderName = ''
        if (req.query.folderName) {
            folderName = req.query.folderName + '/'
        }
        let fieldName = file.fieldname.replace(/ /g, '_');
        let originalname = file.originalname.replace(/ /g, '_');

        const fileName = folderName + Date.now() + "_" + fieldName + "_" + originalname;
        cb(null, fileName);
    }
});

function sanitizeFile(file, cb) {
    const fileExts = [".png", ".jpg", ".jpeg", ".gif", ".pdf"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );
  
    const isAllowedMimeType = file.mimetype.startsWith("image/");
    const isAllowedpdf = file.mimetype.startsWith("application/pdf");

    if ( (isAllowedExt && isAllowedMimeType) || isAllowedpdf) {
        return cb(null, true); // no errors
    } else {
        cb("Error: File type not allowed!");
    }
}


const uploadDoc = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 2mb file size
    }
})

module.exports = uploadDoc;