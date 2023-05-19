'use strict';
let Promise = require('bluebird');
const model = require('../../../models');
const { sendErrorResponse } = require('../../../utils/sendResponse');
const common = require('./Common');
const { Proposal, ProposalTermsCondition } = model;

module.exports = {
    checkProposal: checkProposal,
    getTermConditionTemplates: getTermConditionTemplates,
    updateProposalTermCondition: updateProposalTermCondition,
};

function checkProposal(proposalId, res, cb) {
    return Proposal.findByPk(proposalId).then((proposal) => {
        if (!proposal) cb(null, sendErrorResponse(res, 404, 'Proposal not found'));
    })
} 

function getTermConditionTemplates(organisationId, pageSize, page, search, res, cb) {
    let whereCondition = {};
    if (search) {
        whereCondition = common.searchAndFilterQuery(search)
    }
    return ProposalTermsCondition.findAndCountAll({
        where: { organisationId: organisationId, isTemplate: true }, order: [
            ['createdAt', 'DESC']
        ],
        distinct: true,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        subQuery: false })
        .then((data) => {
            if (!data) { cb(null, sendErrorResponse(res, 404, 'Proposal Term and Condition data not found')); }
            cb(null, { data: data.rows, count: data.count })
        });
}

function updateProposalTermCondition(Id, reqData, res, cb) {
    return ProposalTermsCondition.findOne({ where: { id: Id } })
        .then((termCondition) => {
            if (!termCondition) { cb(null, sendErrorResponse(res, 404, 'Proposal Term condition data not found')); }
            this.checkProposalAsync(termCondition.proposalId, res, cb);
            if (reqData.internalNote || reqData.internalAttachment) {
                common.addInternalNoteAsync(termCondition, reqData).then((inserted) => {
                    cb(null, inserted);
                })
            }
            return ProposalTermsCondition.update({
                pageNumber: reqData.pageNumber,
                pageTitle: reqData.pageTitle,
                pageText: reqData.pageText,
                acknowledged: reqData.acknowledged,
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