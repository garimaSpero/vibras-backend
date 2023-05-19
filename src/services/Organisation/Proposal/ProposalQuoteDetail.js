'use strict';
let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../../models');
const { sendErrorResponse } = require('../../../utils/sendResponse');
const common = require('./Common');
const { Proposal, ProposalQuoteDetail, ProposalQuoteDetailSection, ProposalQuoteDetailSectionItem, QuoteDetailPageSetting } = model;

module.exports = {
    checkProposal: checkProposal,
    getQuoteDetailTemplates: getQuoteDetailTemplates,
    updateProposalQuoteDetail: updateProposalQuoteDetail,
    addQuoteDetailSections: addQuoteDetailSections,
    deleteSetionOrItem: deleteSetionOrItem,
    updateSectionState: updateSectionState,
    createQuoteDetailPage: createQuoteDetailPage,
    savePageSettings: savePageSettings,
    getPageSettings: getPageSettings
};

function checkProposal(proposalId, res, cb) {
    return Proposal.findByPk(proposalId).then((proposal) => {
        if (!proposal) cb(null, sendErrorResponse(res, 404, 'Proposal not found'));
    })
}

function getQuoteDetailTemplates(organisationId, res, cb) {
    return ProposalQuoteDetail.findAll({ where: { organisationId: organisationId, isTemplate: true } }).then((data) => {
        if (!data) {
             cb(null, sendErrorResponse(res, 404, 'Proposal Quote Detail data not found'));
        }
        cb(null, data);
    });
}

async function addQuoteDetailSections(Id, sectionData) {
    await ProposalQuoteDetailSection.destroy({
        where: {
            proposalQuoteDetailId: Id
        }
    });
    for (const section of sectionData) {
        const { sectionTitle, sectionTotal, QuoteDetailItems } = section;
        const createdSection = await ProposalQuoteDetailSection.create({
            id: crypto.randomUUID(),
            proposalQuoteDetailId: Id,
            sectionTitle,
            sectionTotal,
        });
        for (const item of QuoteDetailItems) {
            const { productId, isOptional, quantity, price, lineTotal } = item;
            await ProposalQuoteDetailSectionItem.create({
                id: crypto.randomUUID(),
                sectionId: createdSection.id,
                productId,
                isOptional,
                quantity,
                price,
                lineTotal,
            });
        }
    }
    return {'status' : 'Success'};
}

function updateProposalQuoteDetail(Id, reqData, res, cb) {
    return ProposalQuoteDetail.findByPk(Id).then((proposalQuote) => {
        if (!proposalQuote) cb(null, sendErrorResponse(res, 404, 'Proposal Quote not found'));
        this.checkProposalAsync(proposalQuote.proposalId, res, cb);
        if (reqData.internalNote || reqData.internalAttachment) {
            common.addInternalNoteAsync(proposalQuote, reqData).then((inserted) => {
                cb(null, inserted);
            })
        }
        return ProposalQuoteDetail.update({
            'pageNumber': reqData.pageNumber,
            'pageTitle': reqData.pageTitle,
            'profitMargin': reqData.profitMargin,
            'quoteSubtotal': reqData.quoteSubtotal,
            'total': reqData.total,
            'note': reqData.note,
            'isActive': reqData.isActive,
            'isTemplate': reqData.isTemplate,
        },{ where: { id: Id } })
        .then((updated) => {
            if (!updated) cb(null, sendErrorResponse(res, 400, 'Something went wrong'));   
            return this.addQuoteDetailSections(Id, reqData.ProposalQuoteDetailSection).then(() => {
                cb(null, 'Success');
            })
        } );
    })
}

function deleteSetionOrItem(sectionId, itemId, pageId, res, cb) {
    let model;
    let id;
    switch (true) {
        case sectionId !== '' && typeof sectionId !== 'undefined':
            model = ProposalQuoteDetailSection;
            id = sectionId;
            break;

        case itemId !== '' && typeof itemId !== 'undefined':
            model = ProposalQuoteDetailSectionItem;
            id = itemId;
            break;

        case pageId !== '' && typeof pageId !== 'undefined':
            model = ProposalQuoteDetail;
            id = pageId;
            break;

        default:
            break;
    }

    return model.findByPk(id).then((exsists) => {
        if (!exsists) {
            cb(sendErrorResponse(res, 404, 'Data not found'));
        } else {
            return model.destroy({
                where: {
                    id: id
                }
            }).then(function (rowDeleted) {
                if (rowDeleted === 1) {
                    cb(null, 'Data deleted successfully');
                }
            })
        }
    });
}

function updateSectionState(Id, reqData, res, cb) {
    return ProposalQuoteDetailSection.findByPk(Id).then((proposalSection) => {
        if (!proposalSection) cb(null, sendErrorResponse(res, 404, 'Section data not found'));
        return ProposalQuoteDetailSection.update({
            'isActive': reqData.isActive,
        }, { where: { id: Id } }).then((updated) => {
            if (!updated) cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
            cb(null, 'Success');
        });
    })
}

function createQuoteDetailPage(reqData, res, cb) {
    return Proposal.findByPk(reqData.proposalId).then((proposal) => {
        if (!proposal) cb(null, sendErrorResponse(res, 404, 'Proposal Not Found'));
        return ProposalQuoteDetail.create({
            'id': crypto.randomUUID(),
            'proposalId': reqData.proposalId,
            'organisationId': proposal.organisationId,
            'pageNumber': reqData.pageNumber,
            'page': 'quote',
            'pageTitle': reqData.pageTitle,
            'profitMargin': reqData.profitMargin,
            'quoteSubtotal': reqData.quoteSubtotal,
            'total': reqData.total,
            'note': reqData.note,
            'isActive': reqData.isActive,
            'isTemplate': reqData.isTemplate,
        }).then((added) => {
            if (!added) cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
            return this.addQuoteDetailSections(added.id, reqData.ProposalQuoteDetailSection).then(() => {
                cb(null, added);
            })
        })
    })
}

function savePageSettings(reqData, res, cb) {
    return ProposalQuoteDetail.findOne({ where: { proposalId: reqData.proposalId }}).then((QuoteDetail) => {
        if (!QuoteDetail) cb(null, sendErrorResponse(res, 404, 'Quote detail page not found'));
        
        return QuoteDetailPageSetting.destroy({
            where: {
                proposalId: QuoteDetail.proposalId
            }
        }).then(function (deleteContact) {
            if (deleteContact === 1) {
                return QuoteDetailPageSetting.create({
                    'id': crypto.randomUUID(),
                    'proposalId': QuoteDetail.proposalId,
                    'quoteDetailPageId': reqData.quoteDetailPageId,
                    'showQuantity': reqData.showQuantity,
                    'showUnitPrice': reqData.showUnitPrice,
                    'showLineTotal': reqData.showLineTotal,
                    'showSectionTotal': reqData.showSectionTotal,
                    'selectOnlyOneQuote': reqData.selectOnlyOneQuote,
                }).then((added) => {
                    if (!added) cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                    cb(null, added);
                })
            }
        })
    })
}

function getPageSettings(id, res, cb) {
    return ProposalQuoteDetail.findOne({ where: { proposalId : id }}).then((QuoteDetail) => {
        if (!QuoteDetail) cb(null, sendErrorResponse(res, 404, 'Quote detail page not found'));
        return QuoteDetailPageSetting.findAll({
            where: {
                proposalId: id
            }
        }).then((data) => {
            cb(null, data);
        });
    })
}

Promise.promisifyAll(module.exports);