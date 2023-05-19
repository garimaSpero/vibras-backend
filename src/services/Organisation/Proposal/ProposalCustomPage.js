'use strict';
let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../../models');
const { sendErrorResponse } = require('../../../utils/sendResponse');
const { Proposal, ProposalCustomPage } = model;
const { deleteS3Object } = require('../../../utils/s3Utils');
const common = require('./Common');

module.exports = {
    createProposalCustomPage: createProposalCustomPage,
    updateProposalCustomPage: updateProposalCustomPage,
    deleteCustomPage: deleteCustomPage
};

function createProposalCustomPage(reqData, res, cb) {
    return Proposal.findByPk(reqData.proposalId).then((proposal) => {
        if (!proposal) { cb(null, sendErrorResponse(res, 404, 'Proposal not found')); }
    
        let name = '';
        if (reqData.file) {
            let fileUrl = reqData.file;
            const nameSegments = fileUrl.split('/');
            name = nameSegments[nameSegments.length - 1];
        }
        
        return ProposalCustomPage.create({
            'id': crypto.randomUUID(),
            'proposalId': reqData.proposalId,
            'organisationId': proposal.organisationId,
            'page': 'custom',
            'pageNumber': reqData.pageNumber,
            'pageTitle': reqData.pageTitle,
            'type': reqData.type,
            'name': name,
            'file': reqData.file,
            'pageText': reqData.pageText,
        }).then((added) => {
            cb(null, added);
        }).catch((error) => {
            console.log(error);
            cb(error);
        });
    })
}

function updateProposalCustomPage(id, reqData, res, cb) {
    return ProposalCustomPage.findOne({ where: { id: id } }).then((customPage) => {
        if (!customPage) { cb(null, sendErrorResponse(res, 404, 'Page not found')); }
        let name = '';
        if (reqData.internalNote || reqData.internalAttachment) {
            return common.addInternalNoteAsync(customPage, reqData).then((inserted) => {
                cb(null, inserted);
            })
        }
        if (reqData.file) {
            let fileUrl = reqData.file;
            const nameSegments = fileUrl.split('/');
            name = nameSegments[nameSegments.length - 1];
        }
        return ProposalCustomPage.update({
            'proposalId': reqData.proposalId,
            'pageNumber': reqData.pageNumber,
            'pageTitle': reqData.pageTitle,
            'type': reqData.type,
            'name': name,
            'file': reqData.file,
            'pageText': reqData.pageText,
        }, {
            where: { id: id }
        }).then((updatePage) => {
            if (!updatePage) {
                return cb(null, sendErrorResponse(res, 400, 'Something went worng!'));
            }
            cb(null, updatePage);
        });
    });
}

function deleteCustomPage(id, res, cb) {
    return ProposalCustomPage.findByPk(id).then((page) => {
        if (!page) {
            cb(sendErrorResponse(res, 404, 'Page not found'));
        } else {
            let file = '';
            if (page.type == 'single-use') {
                file = page.file;
            }
            return ProposalCustomPage.destroy({
                where: {
                    id: id
                }
            }).then(function (rowDeleted) {
                if (rowDeleted === 1) {
                    if (file){
                        deleteS3Object(file);
                    }
                    cb(null, 'Page deleted successfully');
                }
            })
        }
    });
}

Promise.promisifyAll(module.exports);