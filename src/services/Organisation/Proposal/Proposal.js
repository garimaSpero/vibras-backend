'use strict';
let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../../models');
const { Op } = require('sequelize');
const { sendErrorResponse } = require('../../../utils/sendResponse');
const { User, Proposal, ProposalTitle, ProposalIntroduction, ProposalQuoteDetail, ProposalTermsCondition, ProposalWarranties, Organisation, ContactProposal, Contact, ProposalQuoteDetailSection, ProposalQuoteDetailSectionItem, ContactAddresses, ProposalCustomPage, ProposalInternalNote, OrganisationProduct, QuoteDetailPageSetting } = model;
const common = require('./Common');
const { Sequelize } = require('sequelize');
const Handlebars = require('handlebars');
const pdf = require('html-pdf');
const path = require('path');
const fsPromises = require('fs/promises');
const { uploadPdf } = require('../../../utils/s3Utils');
const { deleteS3Object } = require('../../../utils/s3Utils');
const { sendProposalEmail } = require("../../../utils/emailUtils");

module.exports = {
    getProposalTemplates: getProposalTemplates,
    getProposals: getProposals,
    getProposal: getProposal,
    createProposal: createProposal,
    updateProposal: updateProposal,
    deleteProposal: deleteProposal,
    saveAsTemplate: saveAsTemplate,
    changePageOrder: changePageOrder,
    getPdf: getPdf,
    generateTitlePdf: generateTitlePdf,
    generateIntroPdf: generateIntroPdf,
    generateWarrantyPdf: generateWarrantyPdf,
    generateQuoteDetailPdf: generateQuoteDetailPdf,
    generateTermPdf: generateTermPdf,
    generateProposalPdf: generateProposalPdf,
    generateCustomPdf: generateCustomPdf,
    duplicateExistingProposal: duplicateExistingProposal,
    sendPdf: sendPdf
};

function getProposalTemplates(organisationId, pageSize, page, search, res, cb) {
    return Organisation.findByPk(organisationId).then((organisation) => {
        if (!organisation) cb(null, sendErrorResponse(res, 404, 'Organisation not exists'));

        let whereCondition = {};
        if (search) {
            whereCondition = common.searchAndFilterQuery(search)
        }
        return Proposal.findAndCountAll({
            where: {
                organisationId: organisationId,
                [Op.and]: whereCondition,
                isTemplate: true
            },
            attributes: [
                'id',
                'name',
                'colorCode',
                'isCustom',
                'isActive',
                'isTemplate',
                'createdAt',
                [Sequelize.literal('ProposalTitle.image'), 'image']
            ],
            include: [
                {
                    model: ContactProposal,
                    as: 'ContactProposal',
                    where: (search.status && search.status !== '') ? { status: search.status } : {},
                    attributes: ['id', 'status'],
                    include: [{
                        model: Contact,
                        attributes: ['id', 'firstName', 'lastName', 'phone'],
                        include: [{
                            model: ContactAddresses,
                            as: 'addresses'
                        }]
                    }]
                },
                {
                    model: ProposalTitle,
                    as: 'ProposalTitle',
                    attributes: []
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            distinct: true,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            subQuery: false
        }).then((proposals) => {
            if (!proposals) cb(null, sendErrorResponse(res, 404, 'Proposals not found'));
            cb(null, { data: proposals.rows, count: proposals.count })
        }).catch((error) => {
            console.log(error);
            cb(error);
        });
    })
}

function getProposals(organisationId, pageSize, page, search, res, cb) {
    return Organisation.findByPk(organisationId).then((organisation) => {
        if (!organisation) cb(null, sendErrorResponse(res, 404, 'Organisation not exists'));
        let whereCondition = {};
        if (search) {
            whereCondition = common.searchAndFilterQuery(search)
        }

        return Proposal.findAndCountAll({
            where: {
                organisationId: organisationId,
                [Op.and]: whereCondition
            },
            attributes: [
                'id',
                'name',
                'colorCode',
                'isCustom',
                'isActive',
                'isTemplate',
                'createdAt',
                [Sequelize.literal('ProposalTitle.image'), 'image'],
                [Sequelize.literal('count(*) over()'), 'total_count']
            ],
            include: [
                {
                    model: ContactProposal,
                    as: 'ContactProposal',
                    where: (search.status && search.status !== '') ? { status: search.status } : {},
                    attributes: ['id', 'status'],
                    include: [{
                        model: Contact,
                        attributes: ['id', 'firstName', 'lastName', 'phone'],
                        include: [{
                            model: ContactAddresses,
                            as: 'addresses',
                        }]
                    }]
                },
                {
                    model: ProposalTitle,
                    as: 'ProposalTitle',
                    attributes: []
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            distinct: true,
            group: ['Proposal.id'],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            subQuery: false,
        }).then((proposals) => {
            if (!proposals) cb(null, sendErrorResponse(res, 404, 'Proposals not found'));
            const totalCount = proposals.count.reduce((sum, current) => {
                return sum + current.count;
            }, 0);
            cb(null, { data: proposals.rows, count: totalCount })
        })
            .catch((error) => {
                console.log(error);
                cb(error);
            });
    })
}

function getProposal(proposalId, res, cb) {
    return Proposal.findOne({
        where: { id: proposalId },
        include: [
            {
                model: ProposalTitle, as: 'ProposalTitle',
                include: [{
                    model: ProposalInternalNote,
                    as: 'ProposalInternalNote',
                }]
            },
            {
                model: ProposalIntroduction, as: 'ProposalIntroduction',
                include: [{
                    model: ProposalInternalNote,
                    as: 'ProposalInternalNote',
                }]
            },
            {
                model: ProposalQuoteDetail, as: 'ProposalQuoteDetail',
                include: [{
                    model: ProposalQuoteDetailSection,
                    as: 'ProposalQuoteDetailSection',
                    include: [{
                        model: ProposalQuoteDetailSectionItem,
                        as: 'QuoteDetailItems',
                        attributes: [
                            'id',
                            'sectionId',
                            'productId',
                            'isOptional',
                            'quantity',
                            'price',
                            'lineTotal',
                        ],
                        include: [{
                            model: OrganisationProduct, as: 'OrganisationProduct',
                            attributes: ['name', 'description']

                        }]
                    }]
                },
                {
                    model: ProposalInternalNote,
                    as: 'ProposalInternalNote',
                }]
            },
            {
                model: ProposalTermsCondition, as: 'ProposalTermsCondition',
                include: [{
                    model: ProposalInternalNote,
                    as: 'ProposalInternalNote',
                }]
            },
            {
                model: ProposalWarranties, as: 'ProposalWarranty',
                include: [{
                    model: ProposalInternalNote,
                    as: 'ProposalInternalNote',
                }]
            },
            {
                model: ContactProposal, as: 'ContactProposal'
            },
            {
                model: ProposalCustomPage, as: 'ProposalCustomPage',
                include: [{
                    model: ProposalInternalNote,
                    as: 'ProposalInternalNote',
                }]
            }
        ]
    }).then((proposal) => {
        if (!proposal) cb(null, sendErrorResponse(res, 404, 'Proposals not found'));

        const { ProposalQuoteDetail } = proposal.dataValues;

        if (ProposalQuoteDetail?.length) {
            ProposalQuoteDetail.forEach((quoteDetail) => {
                const { ProposalQuoteDetailSection } = quoteDetail;

                if (ProposalQuoteDetailSection?.length) {
                    ProposalQuoteDetailSection.forEach((quoteDetailSection) => {
                        const { QuoteDetailItems } = quoteDetailSection;

                        if (QuoteDetailItems?.length) {
                            QuoteDetailItems.forEach((detailItem) => {
                                const { OrganisationProduct } = detailItem;

                                if (OrganisationProduct) {
                                    const { name, description } = OrganisationProduct;

                                    if (name) {
                                        detailItem.dataValues.name = name;
                                    }

                                    if (description) {
                                        detailItem.dataValues.description = description;
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
        cb(null, proposal)
    }).catch(err => {
        console.log(err);
    });
}

function createProposal(userId, reqData, res, cb) {
    return User.findByPk(userId)
        .then((user) => {
            if (!user) { cb(null, sendErrorResponse(res, 404, 'User not exists')); }

            if (reqData.proposalId) {
                return this.duplicateExistingProposalAsync(reqData, res).then((proposalId) => {
                    cb(null, proposalId);
                })
            } else {
                return Proposal.create({
                    id: crypto.randomUUID(),
                    name: reqData.name,
                    organisationId: user.organisationId,
                }).then((proposal) => {
                    return ContactProposal.create({
                        id: crypto.randomUUID(),
                        contactId: reqData.contactId,
                        proposalId: proposal.id,
                        organisationId: user.organisationId,
                    }).then((created) => {
                        if (created) {
                            return Contact.findByPk(reqData.contactId, {
                                include: [{
                                    model: ContactAddresses,
                                    as: 'addresses',
                                }]
                            }).then((contact) => {
                                if (contact) {
                                    return ProposalTitle.update({
                                        'firstName': contact.firstName,
                                        'lastName': contact.lastName,
                                        'address': contact.addresses[0] ? contact.addresses[0].address : null,
                                        'city': contact.addresses[0] ? contact.addresses[0].city : null,
                                        'state': contact.addresses[0] ? contact.addresses[0].state : null,
                                        'zipCode': contact.addresses[0] ? contact.addresses[0].zip : null
                                    },
                                        {
                                            where: { proposalId: proposal.id }
                                        }).then((updated) => {
                                            if (updated) {
                                                cb(null, proposal);
                                            }
                                        })
                                }
                            })
                        }
                    })
                });
            }
        });
}

function updateProposal(proposalId, reqData, res, cb) {
    return Proposal.findOne({ where: { id: proposalId } }).then((proposal) => {
        if (!proposal) { cb(null, sendErrorResponse(res, 404, 'Proposal no exits with this ID!')); }
        return Proposal.update({
            name: reqData.name,
            colorCode: reqData.colorCode,
            isCustom: reqData.isCustom,
            isActive: reqData.isActive,
            isTemplate: reqData.isTemplate
        }, {
            where: { id: proposal.id }
        }).then((updateProposal) => {
            if (!updateProposal) {
                cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
            }
            if (reqData.contactId) {
                return ContactProposal.update({
                    contactId: reqData.contactId
                }, {
                    where: { proposalId: proposal.id }
                }).then(() => {
                    cb(null, updateProposal)
                })
            }
            cb(null, updateProposal);
        });
    });
}

function deleteProposal(proposalId, res, cb) {
    return Proposal.findByPk(proposalId).then((proposal) => {
        if (!proposal) { return cb(null, sendErrorResponse(res, 404, 'Proposal no exits with this ID!')); }
        return Proposal.destroy({
            where: {
                id: proposal.id
            },
        }).then(function (rowDeleted) {
            if (rowDeleted === 1) {
                cb(null, 'Proposal deleted successfully');
            }
        });
    });
}

function saveAsTemplate(reqData, res, cb) {
    const isTemplate = reqData.isTemplate === true ? 1 : 0;
    let modelName = '';

    switch (reqData.type) {
        case 'title':
            modelName = ProposalTitle;
            break;
        case 'introduction':
            modelName = ProposalIntroduction;
            break;
        case 'quote-detail':
            modelName = ProposalQuoteDetail;
            break;
        case 'term-condition':
            modelName = ProposalTermsCondition;
            break;
        case 'warranty':
            modelName = ProposalWarranties;
            break;
        case 'proposal':
            modelName = Proposal;
            break;
        default:
            cb(null, 'Success');
    }
    return modelName.update({
        isTemplate: isTemplate
    }, {
        where: { id: reqData.id }
    }).then(() => {
        cb(null, 'Success');
    });
}

function changePageOrder(reqData, res, cb) {
    let modelOneName, modelTwoName;

    if (reqData.pageOneType === 'title') {
        modelOneName = ProposalTitle;
    } else if (reqData.pageOneType === 'introduction') {
        modelOneName = ProposalIntroduction;
    } else if (reqData.pageOneType === 'quote-detail') {
        modelOneName = ProposalQuoteDetail;
    } else if (reqData.pageOneType === 'term-condition') {
        modelOneName = ProposalTermsCondition;
    } else if (reqData.pageOneType === 'warranty') {
        modelOneName = ProposalWarranties;
    } else if (reqData.pageOneType === 'custom') {
        modelOneName = ProposalCustomPage;
    }

    if (reqData.pageTwoType === 'title') {
        modelTwoName = ProposalTitle;
    } else if (reqData.pageTwoType === 'introduction') {
        modelTwoName = ProposalIntroduction;
    } else if (reqData.pageTwoType === 'quote-detail') {
        modelTwoName = ProposalQuoteDetail;
    } else if (reqData.pageTwoType === 'term-condition') {
        modelTwoName = ProposalTermsCondition;
    } else if (reqData.pageTwoType === 'warranty') {
        modelTwoName = ProposalWarranties;
    } else if (reqData.pageTwoType === 'custom') {
        modelTwoName = ProposalCustomPage;
    }

    return modelOneName.update({
        pageNumber: reqData.pageOneNo
    }, {
        where: { id: reqData.pageOneId }
    }).then(() => {
        return modelTwoName.update({
            pageNumber: reqData.pageTwoNo
        }, {
            where: { id: reqData.pageTwoId }
        }).then((updated) => {
            cb(null, 'Success');
        });
    });
}

function generateTitlePdf(id, cb) {
    try {
        return ProposalTitle.findOne({
            where: { id: id },
            attributes: [
                'pageNumber',
                'page',
                'pageTitle',
                'name',
                'proposalDate',
                'image',
                'logo',
                'firstName',
                'lastName',
                'address',
                'city',
                'state',
                'zipCode',
                'pdf'
            ], include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'email', 'phone']
                },
                {
                    model: Organisation,
                    attributes: ['logo']
                },
            ]
        }).then((pageData) => {
            if (!pageData) {
                cb(sendErrorResponse(res, 404, 'Data not found'));
            }

            const existingPdfUrl = pageData.pdf ?? null;
            return generatePdfUrl(pageData.dataValues, '../../pdf/Title.html').then((pdfResponse) => {
                return ProposalTitle.update({
                    pdf: pdfResponse.Location,
                }, {
                    where: { id: id }
                }).then(() => {
                    if (existingPdfUrl) {
                        deleteS3Object(existingPdfUrl);
                    }
                    cb(null, pdfResponse.Location)
                });
            });
        });
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

async function generatePdfUrl(pageData, fileName, settings = null, pageBreak = false) {
    const filePath = path.join(__dirname, fileName);
    try {
        const html = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
        if (settings) {
            pageData = pageData.map((d) => {
                return { ...d, settings: settings };
            });
        }
        const data = {
            'pageData': pageData,
            'pageBreak': pageBreak
        }
        const template = Handlebars.compile(html);
        const pdfHtml = template(data);
        return await generatePdfFromHtml(pdfHtml);
    } catch (err) {
        throw err;
    }
}

function generateIntroPdf(id, cb) {
    try {
        return ProposalIntroduction.findOne({
            where: { id: id },
            attributes: [
                'pageNumber',
                'page',
                'pageTitle',
                'pageText',
                'pdf'
            ]
        }).then((pageData) => {
            if (!pageData) {
                cb(sendErrorResponse(res, 404, 'Data not found'));
            }
            const existingPdfUrl = pageData.pdf ?? null;

            return generatePdfUrl(pageData.dataValues, '../../pdf/Intro.html').then((pdfResponse) => {
                return ProposalIntroduction.update({
                    pdf: pdfResponse.Location,
                }, {
                    where: { id: id }
                }).then(() => {
                    if (existingPdfUrl) {
                        deleteS3Object(existingPdfUrl);
                    }
                    cb(null, pdfResponse.Location)
                });
            });
        });
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

function generateWarrantyPdf(id, cb) {
    try {
        return ProposalWarranties.findOne({
            where: { id: id },
            attributes: [
                'pageNumber',
                'page',
                'pageTitle',
                'warrantyStartDate',
                'pageText',
                'pdf'
            ]
        }).then((pageData) => {
            if (!pageData) {
                cb(sendErrorResponse(res, 404, 'Data not found'));
            }
            const existingPdfUrl = pageData.pdf ?? null;

            return generatePdfUrl(pageData.dataValues, '../../pdf/Warranty.html').then((pdfResponse) => {
                return ProposalWarranties.update({
                    pdf: pdfResponse.Location,
                }, {
                    where: { id: id }
                }).then(() => {
                    if (existingPdfUrl) {
                        deleteS3Object(existingPdfUrl);
                    }
                    cb(null, pdfResponse.Location)
                });
            });
        });
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

function generateQuoteDetailPdf(id, cb) {
    try {
        return ProposalQuoteDetail.findAll({
            where: { proposalId: id },
            attributes: [
                'pageNumber',
                'page',
                'pageTitle',
                'quoteSubtotal',
                'total',
                'pdf',
                'note'
            ],
            include: [
                {
                    model: ProposalQuoteDetailSection,
                    as: 'ProposalQuoteDetailSection',
                    attributes: [
                        'sectionTitle'
                    ],
                    include: [{
                        model: ProposalQuoteDetailSectionItem,
                        as: 'QuoteDetailItems',
                        attributes: [
                            'id',
                            'productId',
                            'isOptional',
                            'quantity',
                            'price',
                            'lineTotal',
                        ],
                        include: [{
                            model: OrganisationProduct,
                            as: 'OrganisationProduct',
                            attributes: ['name', 'description']
                        }]
                    }]
                },
                {
                    model: QuoteDetailPageSetting,
                    attributes: ['showQuantity', 'showUnitPrice', 'showLineTotal', 'showSectionTotal', 'selectOnlyOneQuote']
                }],
            order: [
                ['createdAt', 'ASC']
            ]
        }).then((pageData) => {
            if (!pageData) {
                cb(sendErrorResponse(res, 404, 'Data not found'));
            }
            const quoteDetailPageSettings = pageData
                .filter(d => d.QuoteDetailPageSetting !== null)
                .map(d => d.QuoteDetailPageSetting);
            let pageSettings = '';
            if (quoteDetailPageSettings.length > 0) {
                pageSettings = quoteDetailPageSettings[0].dataValues;
            }
            
            let existingPdfUrl = '';
            if (pageData && pageData.length) {
                pageData.forEach(data => {
                    existingPdfUrl = data.dataValues.pdf;
                });
            }
            return generatePdfUrl(pageData, '../../pdf/QuoteDetail.html', pageSettings).then((pdfResponse) => {
                return ProposalQuoteDetail.update({
                    pdf: pdfResponse.Location,
                }, {
                    where: { proposalId: id }
                }).then(() => {
                    if (existingPdfUrl) {
                        deleteS3Object(existingPdfUrl);
                    }
                    cb(null, pdfResponse.Location)
                });
            });
        });
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

function generateTermPdf(id, cb) {
    try {
        return ProposalTermsCondition.findOne({
            where: { id: id },
            attributes: [
                'pageNumber',
                'page',
                'pageTitle',
                'pageText',
                'acknowledged',
                'pdf'
            ]
        }).then((pageData) => {
            if (!pageData) {
                cb(sendErrorResponse(res, 404, 'Data not found'));
            }
            const existingPdfUrl = pageData.pdf ?? null;

            return generatePdfUrl(pageData.dataValues, '../../pdf/TermCondition.html').then((pdfResponse) => {
                return ProposalTermsCondition.update({
                    pdf: pdfResponse.Location,
                }, {
                    where: { id: id }
                }).then(() => {
                    if (existingPdfUrl) {
                        deleteS3Object(existingPdfUrl);
                    }
                    cb(null, pdfResponse.Location)
                });
            });
        });
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

function generateProposalPdf(id, cb) {
    try {
        return Proposal.findOne({
            where: { id: id },
            attributes: [
                'name',
                'colorCode',
                'pdf'
            ],
            include: [
                {
                    model: ProposalTitle,
                    as: 'ProposalTitle',
                    where: { isActive: true },
                    required: false,
                    attributes: [
                        'pageNumber',
                        'page',
                        'pageTitle',
                        'name',
                        'proposalDate',
                        'image',
                        'logo',
                        'firstName',
                        'lastName',
                        'address',
                        'city',
                        'state',
                        'zipCode',
                    ], include: [{
                        model: User,
                        attributes: ['firstName', 'lastName', 'email', 'phone']
                    }, {
                        model: Organisation,
                        attributes: ['logo']
                    }]
                },
                {
                    model: ProposalIntroduction,
                    as: 'ProposalIntroduction',
                    where: { isActive: true },
                    required: false,
                    attributes: [
                        'pageNumber',
                        'page',
                        'pageTitle',
                        'pageText',
                    ]
                },
                {
                    model: ProposalQuoteDetail,
                    as: 'ProposalQuoteDetail',
                    where: { isActive: true },
                    required: false,
                    attributes: [
                        'pageNumber',
                        'page',
                        'pageTitle',
                        'quoteSubtotal',
                        'total',
                        'note'
                    ],
                    include: [{
                        model: ProposalQuoteDetailSection,
                        as: 'ProposalQuoteDetailSection',
                        attributes: [
                            'sectionTitle'
                        ],
                        include: [{
                            model: ProposalQuoteDetailSectionItem,
                            as: 'QuoteDetailItems',
                            attributes: [
                                'id',
                                'productId',
                                'isOptional',
                                'quantity',
                                'price',
                                'lineTotal',
                            ],
                            include: [{
                                model: OrganisationProduct,
                                as: 'OrganisationProduct',
                                attributes: ['name', 'description']
                            }]
                        }]
                    },
                    {
                        model: QuoteDetailPageSetting,
                        attributes: ['showQuantity', 'showUnitPrice', 'showLineTotal', 'showSectionTotal', 'selectOnlyOneQuote']
                    }]
                },
                {
                    model: ProposalTermsCondition,
                    as: 'ProposalTermsCondition',
                    where: { isActive: true },
                    required: false,
                },
                {
                    model: ProposalWarranties,
                    as: 'ProposalWarranty',
                    where: { isActive: true },
                    required: false,
                },
                {
                    model: ProposalCustomPage,
                    as: 'ProposalCustomPage',
                    where: { isActive: true },
                    required: false,
                }
            ],
        }).then((proposal) => {
            if (!proposal) {
                cb(sendErrorResponse(res, 404, 'Proposal not found'));
            }

            const existingPdfUrl = proposal.pdf ?? null;
            const title = proposal.ProposalTitle;
            const intro = proposal.ProposalIntroduction;
            const terms = proposal.ProposalTermsCondition;
            const warranty = proposal.ProposalWarranty;
            const quoteDetail = proposal.ProposalQuoteDetail;
            const customPage = proposal.ProposalCustomPage;
            const quoteDetailPageSettings = quoteDetail
                .filter(d => d.QuoteDetailPageSetting !== null)
                .map(d => d.QuoteDetailPageSetting);

            let pageSettings = '';

            if (quoteDetailPageSettings.length > 0) {
                pageSettings = quoteDetailPageSettings[0].dataValues;
            }
            if (quoteDetail.length > 0) {
                quoteDetail.forEach((q) => {
                    q.dataValues.settings = { ...pageSettings };
                });
            }
            const sortedProps = [
                title,
                intro,
                terms,
                warranty,
                ...quoteDetail,
                ...customPage
            ].sort((a, b) => {
                const aPageNumber = a && a.pageNumber;
                const bPageNumber = b && b.pageNumber;

                if (aPageNumber !== undefined && bPageNumber !== undefined) {
                    return aPageNumber - bPageNumber;
                } else if (aPageNumber !== undefined) {
                    return -1;
                } else if (bPageNumber !== undefined) {
                    return 1;
                } else {
                    return 0;
                }
            });

            return generatePdfHtml(sortedProps).then((pdfResponse) => {
                return Proposal.update({
                    pdf: pdfResponse.Location,
                }, {
                    where: { id: id }
                }).then(() => {
                    if (existingPdfUrl) {
                        deleteS3Object(existingPdfUrl);
                    }
                    cb(null, pdfResponse.Location)
                });
            });
        })
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

function generateCustomPdf(id, cb) {
    try {
        return ProposalCustomPage.findOne({
            where: { id: id },
            attributes: [
                'pageNumber',
                'page',
                'pageTitle',
                'pageText',
                'type',
                'pdf'
            ],
            order: [
                ['createdAt', 'ASC']
            ]
        }).then((pageData) => {
            if (!pageData) {
                cb(sendErrorResponse(res, 404, 'Data not found'));
            }
            const existingPdfUrl = pageData.dataValues.pdf ?? null;

            if (pageData.dataValues.type == 'text-page') {
                return generatePdfUrl(pageData.dataValues, '../../pdf/Custom.html').then((pdfResponse) => {
                    return ProposalCustomPage.update({
                        pdf: pdfResponse.Location,
                    }, {
                        where: { proposalId: id }
                    }).then(() => {
                        if (existingPdfUrl) {
                            deleteS3Object(existingPdfUrl);
                        }
                        cb(null, pdfResponse.Location)
                    });
                });
            } else {
                cb(null, 'Page data not Found')
            }
        });
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

function getPdf(id, type, res, cb) {
    switch (type) {
        case 'title':
            return this.generateTitlePdfAsync(id).then((data) => {
                cb(null, data);
            });

        case 'introduction':
            return this.generateIntroPdfAsync(id).then((data) => {
                cb(null, data);
            });
        case 'quote-detail':
            return this.generateQuoteDetailPdfAsync(id).then((data) => {
                cb(null, data);
            });
        case 'warranty':
            return this.generateWarrantyPdfAsync(id).then((data) => {
                cb(null, data);
            });
        case 'term-condition':
            return this.generateTermPdfAsync(id).then((data) => {
                cb(null, data);
            });
        case 'custom':
            return this.generateCustomPdfAsync(id).then((data) => {
                cb(null, data);
            });
        case 'proposal':
            return this.generateProposalPdfAsync(id).then((data) => {
                cb(null, data);
            });
        default:
            cb(new Error('Invalid PDF type'));
    }
}

async function generatePdfHtml(sortedProps) {
    const htmlPromises = Promise.map(sortedProps, async (element) => {
        let pageData = element?.dataValues;
        if (pageData?.page == 'title') {
            if (pageData) {
                const titlefilePath = path.join(__dirname, '../../pdf/Title.html');
                const html = await fsPromises.readFile(titlefilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData,
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'intro') {
            if (pageData) {
                const introfilePath = path.join(__dirname, '../../pdf/Intro.html');
                const html = await fsPromises.readFile(introfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData,
                    'pageBreak': true
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'term') {
            if (pageData) {
                const termfilePath = path.join(__dirname, '../../pdf/TermCondition.html');
                const html = await fsPromises.readFile(termfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData,
                    'pageBreak': true
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'warranty') {
            if (pageData) {
                const warrantyfilePath = path.join(__dirname, '../../pdf/Warranty.html');
                const html = await fsPromises.readFile(warrantyfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData,
                    'pageBreak': true
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'quote') {
            if (pageData) {
                const quotefilePath = path.join(__dirname, '../../pdf/QuoteDetailSingle.html');
                const html = await fsPromises.readFile(quotefilePath, { encoding: 'utf-8' });
                const data = {
                    'quoteData': pageData,
                    'pageBreak': true
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'custom') {
            if (pageData) {
                const customfilePath = path.join(__dirname, '../../pdf/Custom.html');
                const html = await fsPromises.readFile(customfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData,
                    'pageBreak': true
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }
        return null;
    });

    const pdfHtmlArr = await htmlPromises.filter(html => html !== null);
    const pdfHtml = pdfHtmlArr.join('');
    return await generatePdfFromHtml(pdfHtml);
}

async function generatePdfFromHtml(pdfHtml) {
    const options = {
        format: 'A4',
        border: {
            top: '0',
            bottom: '0.5cm'
        },
        paginationOffset: 0,
        header: {
            height: '0'
        },
        footer: {
            height: '0'
        },
        margin: '0',
        base: `file://${__dirname}/`
    };

    const pdfDoc = pdf.create(pdfHtml, options);
    const buffer = await new Promise((resolve, reject) => {
        pdfDoc.toBuffer((err, buff) => {
            if (err) {
                reject(err);
            } else {
                resolve(buff);
            }
        });
    });

    try {
        return await uploadPdf(buffer);
    } catch (err) {
        console.error('Error uploading PDF:', err);
        throw err;
    }
}

function duplicateExistingProposal(reqData, res, cb) {
    const id = reqData.proposalId;
    return Proposal.findOne({
        where: { id: id },
        attributes: ['organisationId', 'name', 'colorCode', 'isCustom', 'isActive'],
        include: [
            {
                model: ProposalTitle, as: 'ProposalTitle',
                attributes: [
                    'pageNumber',
                    'pageTitle',
                    'name',
                    'proposalDate',
                    'image',
                    'imageThumbnail',
                    'logo',
                    'logoThumbnail',
                    'firstName',
                    'lastName',
                    'address',
                    'city',
                    'state',
                    'zipCode',
                    'isActive'
                ]
            },
            {
                model: ProposalIntroduction, as: 'ProposalIntroduction',
                attributes: [
                    'pageNumber',
                    'pageTitle',
                    'pageText',
                    'isActive'
                ]
            },
            {
                model: ProposalQuoteDetail, as: 'ProposalQuoteDetail',
                attributes: [
                    'organisationId',
                    'pageNumber',
                    'page',
                    'pageTitle',
                    'profitMargin',
                    'quoteSubtotal',
                    'total',
                    'note',
                    'isActive'
                ],
                include: [{
                    model: ProposalQuoteDetailSection,
                    as: 'ProposalQuoteDetailSection',
                    attributes: ['sectionTitle', 'sectionTotal', 'isActive'],
                    include: [{
                        model: ProposalQuoteDetailSectionItem,
                        as: 'QuoteDetailItems',
                        attributes: [
                            'sectionId',
                            'productId',
                            'isOptional',
                            'quantity',
                            'price',
                            'lineTotal',
                        ],
                        include: [{
                            model: OrganisationProduct, as: 'OrganisationProduct',
                            attributes: ['organisationId', 'name', 'description']
                        }]
                    }]
                }]
            },
            {
                model: ProposalTermsCondition, as: 'ProposalTermsCondition',
                attributes: [
                    'pageNumber',
                    'pageTitle',
                    'acknowledged',
                    'pageText',
                    'isActive'
                ],
            },
            {
                model: ProposalWarranties, as: 'ProposalWarranty',
                attributes: [
                    'pageNumber',
                    'pageTitle',
                    'warrantyStartDate',
                    'pageText',
                    'isActive'
                ],
            },
            {
                model: ContactProposal,
                as: 'ContactProposal',
                attributes: ['contactId'],
            },
            {
                model: ProposalCustomPage,
                as: 'ProposalCustomPage',
                attributes: [
                    'organisationId',
                    'pageTitle',
                    'pageNumber',
                    'type',
                    'name',
                    'file',
                    'pageText'
                ],
            }
        ]
    }).then((proposal) => {
        return Proposal.create({
            name: proposal.name,
            organisationId: proposal.organisationId,
        }).then((created) => {
            let contactId = reqData.contactId ? reqData.contactId : proposal.ContactProposal.dataValues.contactId;
            return ContactProposal.create({
                id: crypto.randomUUID(),
                contactId: contactId,
                proposalId: created.id,
                organisationId: created.organisationId,
            }).then(() => {
                return created.id;
            })
        }).then((proposalId) => {
            return createTitleDuplicate(proposalId, proposal);
        }).then((proposalId) => {
            return createIntroDuplicate(proposalId, proposal);
        }).then((proposalId) => {
            return createTermAndConditionDuplicate(proposalId, proposal)
        }).then((proposalId) => {
            return createWarrantyPageDuplicate(proposalId, proposal);
        }).then((proposalId) => {
            const quoteD = proposal.ProposalQuoteDetail;
            if (quoteD.length > 0) {
                return createQuoteDetailDuplicate(proposalId, quoteD);
            }
        }).then((proposalId) => {
            if (proposal.ProposalCustomPage.length > 0) {
                const customData = proposal.ProposalCustomPage;
                return createCustomPageDuplicate(proposalId, customData).then(() => {
                    cb(null, proposalId);
                });
            } else {
                cb(null, proposalId);
            }
        });
    }).catch((error) => {
        console.log(error);
        cb(error);
    });
}

async function createTitleDuplicate(proposalId, proposal) {
    try {
        const proposalData = proposal.ProposalTitle.dataValues;
        await ProposalTitle.update({
            'pageNumber': proposalData.pageNumber,
            'pageTitle': proposalData.pageTitle,
            'name': proposalData.name,
            'proposalDate': proposalData.proposalDate,
            'image': proposalData.image,
            'imageThumbnail': proposalData.imageThumbnail,
            'logo': proposalData.logo,
            'logoThumbnail': proposalData.logoThumbnail,
            'firstName': proposalData.firstName,
            'lastName': proposalData.lastName,
            'address': proposalData.address,
            'city': proposalData.city,
            'state': proposalData.state,
            'zipCode': proposalData.zipCode,
            'isActive': proposalData.isActive
        }, { where: { proposalId: proposalId } });
        return proposalId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function createIntroDuplicate(proposalId, proposal) {
    try {
        const proposalData = proposal.ProposalIntroduction.dataValues;
        await ProposalIntroduction.update({
            'pageNumber': proposalData.pageNumber,
            'pageTitle': proposalData.pageTitle,
            'pageText': proposalData.pageText,
            'isActive': proposalData.isActive

        }, { where: { proposalId: proposalId } });
        return proposalId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function createTermAndConditionDuplicate(proposalId, proposal) {
    try {
        const proposalData = proposal.ProposalTermsCondition.dataValues;
        await ProposalTermsCondition.update({
            'pageNumber': proposalData.pageNumber,
            'pageTitle': proposalData.pageTitle,
            'acknowledged': proposalData.acknowledged,
            'pageText': proposalData.pageText,
            'isActive': proposalData.isActive

        }, { where: { proposalId: proposalId } });
        return proposalId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function createWarrantyPageDuplicate(proposalId, proposal) {
    try {
        const proposalData = proposal.ProposalWarranty.dataValues;
        await ProposalWarranties.update({
            'pageNumber': proposalData.pageNumber,
            'pageTitle': proposalData.pageTitle,
            'warrantyStartDate': proposalData.warrantyStartDate,
            'pageText': proposalData.pageText,
            'isActive': proposalData.isActive
        }, { where: { proposalId: proposalId } }
        );
        return proposalId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function createQuoteDetailDuplicate(proposalId, quoteD) {
    try {
        await ProposalQuoteDetail.destroy({
            where: {
                proposalId: proposalId
            }
        });

        for (const d of quoteD) {
            const quote = await ProposalQuoteDetail.create({
                'id': crypto.randomUUID(),
                'proposalId': proposalId,
                'organisationId': d.dataValues.organisationId,
                'pageNumber': d.dataValues.pageNumber,
                'pageTitle': d.dataValues.pageTitle,
                'profitMargin': d.dataValues.profitMargin,
                'quoteSubtotal': d.dataValues.quoteSubtotal,
                'total': d.dataValues.total,
                'note': d.dataValues.note,
                'isActive': d.dataValues.isActive,
            });

            if (quote.id) {
                const quoteSection = d.dataValues.ProposalQuoteDetailSection;
                for (const v of quoteSection) {
                    const added = await ProposalQuoteDetailSection.create({
                        'id': crypto.randomUUID(),
                        'proposalQuoteDetailId': quote.id,
                        'sectionTitle': v.dataValues.sectionTitle,
                        'sectionTotal': v.dataValues.sectionTotal,
                        'isActive': v.dataValues.isActive
                    });

                    const secId = added.id;
                    const sectionItems = v.dataValues.QuoteDetailItems;

                    for (const s of sectionItems) {
                        await ProposalQuoteDetailSectionItem.create({
                            'id': crypto.randomUUID(),
                            'sectionId': secId,
                            'productId': s.dataValues.productId,
                            'isOptional': s.dataValues.isOptional,
                            'quantity': s.dataValues.quantity,
                            'price': s.dataValues.price,
                            'lineTotal': s.dataValues.lineTotal
                        });
                    }
                }
            }
        }
        return proposalId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function createCustomPageDuplicate(proposalId, customData) {
    const newData = customData.map((v) => ({
        id: crypto.randomUUID(),
        proposalId: proposalId,
        organisationId: v.organisationId,
        pageTitle: v.pageTitle,
        pageNumber: v.pageNumber,
        type: v.type,
        name: v.name,
        file: v.file,
        pageText: v.pageText
    }));

    try {
        const custom = await ProposalCustomPage.bulkCreate(newData);

        if (!custom) {
            return "Something went wrong";
        } else {
            return proposalId;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }

}

function sendPdf(id, res, cb) {
    return Proposal.findOne({
        where: { id: id },
        attributes: ['id', 'name', 'colorCode', 'pdf'],
        include: [
            {
                model: ContactProposal,
                as: 'ContactProposal',
                attributes: ['contactId'],
                include: [{
                    model: Contact,
                    attributes: ['email', 'firstName', 'lastName']
                }]
            },
            {
                model: User,
                as: 'User',
                attributes: ['firstName', 'lastName', 'phone'],
            },
            {
                model: Organisation,
                as: 'Organisation',
                attributes: ['businessName'],
            },
        ]
    }).then((proposal) => {
        sendProposalEmail(proposal);
        cb(null, proposal);
    }).catch((error) => {
        console.log(error);
        cb(error);
    });
}

Promise.promisifyAll(module.exports);