'use strict';
let Promise = require('bluebird');
const { Op } = require('sequelize');
const moment = require('moment');
const model = require('../../../models');
const { sendErrorResponse } = require('../../../utils/sendResponse');
const crypto = require('crypto');
const { ProposalInternalNote } = model;

module.exports = {
    searchAndFilterQuery: searchAndFilterQuery,
    addInternalNote: addInternalNote
};

function searchAndFilterQuery(search, cb) {
    const whereCondition = {};
    let formattedDate = '';
    
    if (search.title) {
        whereCondition.name = search.name;
    }
    if (search.pageTitle) {
        whereCondition.name = search.pageTitle;
    }
    if (search.createdAt) {
        if (search.createdAt == '1') {
            const dateBefore24Hours = moment().subtract(24, 'hours');
            formattedDate = dateBefore24Hours.format('YYYY-MM-DD HH:mm:ss');
        }
        if (search.createdAt == '7') {
            const dateBefore24Hours = moment().subtract(7, 'days');
            formattedDate = dateBefore24Hours.format('YYYY-MM-DD HH:mm:ss');
        }
        if (search.createdAt == '30') {
            const dateBefore24Hours = moment().subtract(30, 'days');
            formattedDate = dateBefore24Hours.format('YYYY-MM-DD HH:mm:ss');
        }
        whereCondition.createdAt = {
            [Op.gt]: formattedDate,
        };
        if (search.createdAt == '>30') {
            const dateBefore24Hours = moment().subtract(30, 'days');
            formattedDate = dateBefore24Hours.format('YYYY-MM-DD HH:mm:ss');
            whereCondition.createdAt = {
                [Op.lt]: formattedDate,
            };
        }
    }
    
    return whereCondition;
}

function addInternalNote(pageData, reqData, cb) {
    return ProposalInternalNote.create(
        {
            id: crypto.randomUUID(),
            proposalId: pageData.proposalId,
            pageId: pageData.id,
            note: reqData.internalNote,
            attachment: reqData.internalAttachment
        }
    ).then((added) => {
        if (!added) { return cb(null, sendErrorResponse(res, 400, 'Something went worng!')); }
        cb(null, added);
    }).catch((error) => {
        console.log(error);
        cb(error);
    });

}


Promise.promisifyAll(module.exports);