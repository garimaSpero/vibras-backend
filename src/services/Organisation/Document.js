'use strict';
let Promise = require('bluebird');
const { Op } = require('sequelize');
const crypto = require('crypto');
const model = require('../../models');
const { sendErrorResponse } = require('../../utils/sendResponse');

const { Organisation, OrganisationDocument } = model;
const { deleteS3Object } = require('../../utils/s3Utils');

module.exports = {
    saveDocument: saveDocument,
    listAllDocuments: listAllDocuments,
    getDocument: getDocument,
    deleteDocument: deleteDocument
};

function saveDocument(organisationId, fileUrl, fileName, res, cb) {
    return Organisation.findByPk(organisationId).then((organisation) => {
        if (!organisation) cb(null, sendErrorResponse(res, 404, 'Organisation not found'));
        return OrganisationDocument.create({
            id: crypto.randomUUID(),
            organisationId: organisationId,
            type: 'my-pdf',
            name: fileName,
            file: fileUrl
        }).then((added) => {
            if (!added) cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
            cb(null, added);
        })
    });
}

function listAllDocuments(organisationId, pageSize, page, res, cb) {
    return Organisation.findByPk(organisationId).then((organisation) => {
        if (!organisation) cb(null, sendErrorResponse(res, 404, 'Organisation not found'));
        return OrganisationDocument.findAndCountAll({
            where: { organisationId: organisationId },
            distinct: true,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            subQuery: false,
            order: [
                ['createdAt', 'DESC']
            ],
         }).then((all) => {
            if (!all) cb(null, {});
            cb(null, { data: all.rows, count: all.count });
        })
    });
}

function getDocument(id, res, cb) { 
    return OrganisationDocument.findByPk(id).then((document) => {
        if (!document) cb(null, sendErrorResponse(res, 404, 'Document not found'));
        cb(null, document);
    });
}

function deleteDocument(id, res, cb) {
    return OrganisationDocument.findByPk(id).then((document) => {
        if (!document) cb(null, sendErrorResponse(res, 404, 'Document not found'));
       
        return OrganisationDocument.destroy({
            where: {
                id: id
            }
        }).then(function (rowDeleted) {
            if (rowDeleted === 1) {
                deleteS3Object(document.file);
                cb(null, 'Document deleted successfully');
            }
        })
    });
}

Promise.promisifyAll(module.exports);
