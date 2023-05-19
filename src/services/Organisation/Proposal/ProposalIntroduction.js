'use strict';
let Promise = require('bluebird');
const model = require('../../../models');
const { sendErrorResponse } = require("../../../utils/sendResponse");
const { Proposal, ProposalIntroduction } = model;
const { Op } = require('sequelize');
const common = require('./Common');

module.exports = {
    checkProposal: checkProposal,
    getIntroductionTemplates: getIntroductionTemplates,
    updateProposalIntroduction: updateProposalIntroduction
};

function checkProposal(proposalId, res, cb) {
    return Proposal.findByPk(proposalId).then((proposal) => {
        if (!proposal) cb(null, sendErrorResponse(res, 404, 'Proposal not found'));
    })
}

function getIntroductionTemplates(organisationId, pageSize, page, search, res, cb){
    let whereCondition = null;
    if (search) {
        whereCondition = common.searchAndFilterQuery(search)
    }
    return ProposalIntroduction.findAndCountAll({
        where: { organisationId: organisationId, isTemplate: true },
        distinct: true,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        subQuery: false })
        .then((data) => {
            if (!data) { cb(null, sendErrorResponse(res, 404, 'Proposal Introduction data not found')); }
            cb(null, { data: data.rows, count: data.count })
        });
}

function updateProposalIntroduction(Id, reqData, res, cb) {
    return ProposalIntroduction.findOne({ where: { id: Id } })
        .then((proposalIntroduction) => {
            if (!proposalIntroduction) { cb(null, sendErrorResponse(res, 404, 'Proposal Introduction data not found')); }

            this.checkProposalAsync(proposalIntroduction.proposalId, res, cb);
            if (reqData.internalNote || reqData.internalAttachment) {
                common.addInternalNoteAsync(proposalIntroduction, reqData).then((inserted) => {
                    cb(null, inserted);
                })
            }
            return ProposalIntroduction.update({
                pageNumber: reqData.pageNumber,
                pageTitle: reqData.pageTitle,
                pageText: reqData.pageText,
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