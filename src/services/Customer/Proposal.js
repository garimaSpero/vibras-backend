'use strict';
let Promise = require('bluebird');
const model = require('../../models');
const { sendErrorResponse } = require('../../utils/sendResponse');
const { User, Proposal, ProposalTitle, ProposalIntroduction, ProposalQuoteDetail, ProposalTermsCondition, ProposalWarranties, Organisation, ProposalQuoteDetailSection, ProposalQuoteDetailSectionItem, ProposalCustomPage, OrganisationProduct, QuoteDetailPageSetting, ContactProposal } = model;
const Handlebars = require('handlebars');
const pdf = require('html-pdf');
const path = require('path');
const fsPromises = require('fs/promises');
const { uploadPdf, uploadImage } = require('../../utils/s3Utils');
const { deleteS3Object } = require('../../utils/s3Utils');

module.exports = {
    acceptProposal: acceptProposal,
};

async function acceptProposal(reqData, res, cb) {
    
    const proposalId = reqData.proposalId;
    return Proposal.findOne({
        where: { id: proposalId },
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
                    'total'
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
                            attributes: ['name']
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
                where: { isActive: false },
                required: false,
            },
            {
                model: ProposalCustomPage,
                as: 'ProposalCustomPage',
                where: { isActive: false },
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

        return uploadImage(reqData.base64).then((uploaded) => {
            const fileName = uploaded;
            return generatePdfHtml(sortedProps, fileName).then((pdfResponse) => {
                return ContactProposal.update({
                    signedPdf: pdfResponse.Location,
                    signatureUrl: fileName
                }, {
                    where: { proposalId: proposalId }
                }).then(() => {
                    if (existingPdfUrl) {
                        deleteS3Object(existingPdfUrl);
                    }
                    cb(null, pdfResponse.Location)
                });
            });
        });
    })
}

async function generatePdfHtml(sortedProps, sign) {
    const htmlPromises = Promise.map(sortedProps, async (element) => {
        let pageData = element?.dataValues;
        if (pageData?.page == 'title') {
            if (pageData) {
                const titlefilePath = path.join(__dirname, '../../services/pdf/Title.html');
                const html = await fsPromises.readFile(titlefilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'intro') {
            if (pageData) {
                const introfilePath = path.join(__dirname, '../../services/pdf/Intro.html');
                const html = await fsPromises.readFile(introfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'term') {
            if (pageData) {
                const termfilePath = path.join(__dirname, '../../services/pdf/TermCondition.html');
                const html = await fsPromises.readFile(termfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'warranty') {
            if (pageData) {
                const warrantyfilePath = path.join(__dirname, '../../services/pdf/Warranty.html');
                const html = await fsPromises.readFile(warrantyfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'quote') {
            if (pageData) {
                const quotefilePath = path.join(__dirname, '../../services/pdf/QuoteDetailSingle.html');
                const html = await fsPromises.readFile(quotefilePath, { encoding: 'utf-8' });
                const data = {
                    'quoteData': pageData
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }

        if (pageData?.page == 'custom') {
            if (pageData) {
                const customfilePath = path.join(__dirname, '../../services/pdf/Custom.html');
                const html = await fsPromises.readFile(customfilePath, { encoding: 'utf-8' });
                const data = {
                    'pageData': pageData
                }
                const template = Handlebars.compile(html);
                return template(data);
            }
        }
        return null;
    });
    let signHtml;
    if (sign) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${month}-${day}-${year}`;
        const signfilePath = path.join(__dirname, '../../services/pdf/Sign.html');
        const html = await fsPromises.readFile(signfilePath, { encoding: 'utf-8' });
        const dataSign = {
            'pageData': sign,
            'formattedDate': formattedDate
        }
        const template = Handlebars.compile(html);
        signHtml = template(dataSign);
    }

    const pdfHtmlArr = await htmlPromises.filter(html => html !== null);
    pdfHtmlArr.push(signHtml);
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
Promise.promisifyAll(module.exports);