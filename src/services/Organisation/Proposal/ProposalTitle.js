'use strict';
let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../../models');
const { sendErrorResponse } = require('../../../utils/sendResponse');
const common = require('./Common');
const { Proposal, ProposalTitle, ProposalInternalNote } = model;

module.exports = {
    getTitleTemplates: getTitleTemplates,
    getProposalTitle: getProposalTitle,
    updateProposalTitle: updateProposalTitle,
    addInternalNote: addInternalNote
};

function getTitleTemplates(organisationId, pageSize, page, search, res, cb) {
    let whereCondition = {};
    if (search) {
        whereCondition = common.searchAndFilterQuery(search)
    }

    return ProposalTitle.findAndCountAll({
        where: { organisationId: organisationId, isTemplate: true }, order: [
            ['createdAt', 'DESC']
        ],
        distinct: true,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        subQuery: false })
        .then((proposalTitle) => {
            if (!proposalTitle) { cb(null, sendErrorResponse(res, 404, 'Proposal title no exits with this ID!')); }
            cb(null, { data: proposalTitle.rows, count: proposalTitle.count })
        });
}

function getProposalTitle(proposalId, proposalTitleId, res, cb) {
    return Proposal.findOne({ where: { id: proposalId } })
        .then((proposal) => {
            if (!proposal) { cb(null, sendErrorResponse(res, 404, 'Proposal no exits with this ID!')); return }
            if (proposal.titlePageId != proposalTitleId) { cb(null, sendErrorResponse(res, 404, 'Proposal title id is not exits with this proposal!')); return }
            return ProposalTitle.findOne({ where: { id: proposalTitleId } })
                .then((proposalTitle) => {
                    if (!proposalTitle) { cb(null, sendErrorResponse(res, 404, 'Proposal title no exits with this ID!')); }
                    cb(null, proposalTitle);
                });
        });
}

function updateProposalTitle(Id, reqData, res, cb) {
    return ProposalTitle.findOne({ where: { id: Id } })
        .then((proposalTitle) => {
            if (!proposalTitle) { cb(null, sendErrorResponse(res, 404, 'Proposal Title data not found')); }
           
            if (reqData.internalNote || reqData.internalAttachment) {
                common.addInternalNoteAsync(proposalTitle, reqData).then((inserted) => {
                    cb(null, inserted);
                })
            }
            return ProposalTitle.update({
                pageNumber: reqData.pageNumber,
                pageTitle: reqData.pageTitle,
                name: reqData.name,
                proposalDate: reqData.proposalDate,
                image: reqData.image,
                logo: reqData.logo,
                firstName: reqData.firstName,
                lastName: reqData.lastName,
                address: reqData.address,
                city: reqData.city,
                state: reqData.state,
                zipCode: reqData.zipCode,
                isActive: reqData.isActive,
                isTemplate: reqData.isTemplate
            }, {
                where: { id: Id }
            }).then((updateTitle) => {
                if (!updateTitle) {
                    return cb(null, sendErrorResponse(res, 400, 'Something went worng!'));
                }
                cb(null, proposalTitle);
            });
           
            
        });
}

function addInternalNote (proposalTitle, reqData, cb) {
    return ProposalInternalNote.create(
        {
            id: crypto.randomUUID(),
            proposalId: proposalTitle.proposalId,
            pageId: proposalTitle.id,
            note: reqData.notes,
            attachment: reqData.attachment
        } 
    ).then((added) => {
        if (!added) { return cb(null, sendErrorResponse(res, 400, 'Something went worng!'));  }
        cb(null, added);
    }).catch((error) => {
        console.log(error);
        cb(error);
    });

}

Promise.promisifyAll(module.exports);