'use strict';
let Promise = require('bluebird');
const model = require('../../../models');
const { sendErrorResponse } = require('../../../utils/sendResponse');
const common = require('./Common');
const { Proposal, ProposalWarranties } = model;

module.exports = {
    checkProposal: checkProposal,
    getWarrantyTemplates: getWarrantyTemplates,
    updateProposalWarranty: updateProposalWarranty,
};

function checkProposal(proposalId, res, cb) {
    return Proposal.findByPk(proposalId).then((proposal) => {
        if (!proposal) cb(null, sendErrorResponse(res, 404, 'Proposal not found'));
    })
}

function getWarrantyTemplates(organisationId, pageSize, page, search, res, cb) {
    let whereCondition = {};
    if (search) {
        whereCondition = common.searchAndFilterQuery(search)
    }
    return ProposalWarranties.findAndCountAll({
        where: { organisationId: organisationId, isTemplate: true }, order: [
            ['createdAt', 'DESC']
        ],
        distinct: true,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        subQuery: false })
        .then((data) => {
            if (!data) { cb(null, sendErrorResponse(res, 404, 'Proposal warranty data not found')); }
            cb(null, { data: data.rows, count: data.count })
        });
}

function updateProposalWarranty(Id, reqData, res, cb) {
    return ProposalWarranties.findOne({ where: { id: Id } })
        .then((warranty) => {
            if (!warranty) { cb(null, sendErrorResponse(res, 404, 'Proposal warranty data not found')); }
            this.checkProposalAsync(warranty.proposalId, res, cb);
            if (reqData.internalNote || reqData.internalAttachment) {
                common.addInternalNoteAsync(warranty, reqData).then((inserted) => {
                    cb(null, inserted);
                })
            }
            return ProposalWarranties.update({
                pageNumber: reqData.pageNumber,
                pageTitle: reqData.pageTitle,
                pageText: reqData.pageText,
                warrantyStartDate: reqData.warrantyStartDate,
                isActive: reqData.isActive,
                isTemplate: reqData.isTemplate
            }, {
                where: { id: Id }
            }).then((updated) => {
                if (!updated) {
                    return cb(null, sendErrorResponse(res, 400, 'Something went worng!'));
                }
                cb(null, updated);
            });
        });
}

Promise.promisifyAll(module.exports);