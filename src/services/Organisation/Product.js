'use strict';
const { Op } = require('sequelize');

let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const { randomInt } = require('crypto');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { Organisation, OrganisationProduct, ProductPrice, ProductQuantity, ProductConversionRate, ProductNote, OrganisationProductCategory } = model;
const { deleteS3Object } = require('../../utils/s3Utils');
const { Sequelize } = require('sequelize');

module.exports = {
    getProducts: getProducts,
    getProduct: getProduct,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    
    checkCategory: checkCategory,
    addProductQuantity: addProductQuantity,
    addProductPrice: addProductPrice,
    addProductConversionRate: addProductConversionRate,
    getProductNotes: getProductNotes,
    addProductNote: addProductNote,
    deleteProductNote: deleteProductNote  
};

function getProducts(organisationId, limit, page, res, cb) {
    return Organisation.findByPk(organisationId).then((organisation) => {
        if (!organisation) {
            cb(sendErrorResponse(res, 404, 'organisation not found'));
        }
        return OrganisationProduct.findAndCountAll({
            where: { organisationId: organisationId },
            distinct: true,
            limit: limit,
            offset: (page - 1) * limit,
            subQuery: false,
            attributes: [
                'id',
                'organisationId',
                'categoryId',
                'productNumber',
                'type',
                'name',
                'description',
                'sku',
                'manufacturer',
                'unitOfMeasure',
                'unit',
                'image',
                'imageThumbnail',
                'isActive',
                'isTaxable',
                'requireQuantity',
                'isInventory',
                [Sequelize.literal('OrganisationProductCategory.name'), 'categoryName'],
                [Sequelize.literal('ProductPrices.price'), 'price'],
                [Sequelize.literal('ProductQuantities.stock'), 'stock']
            ],
            include: [ 
                { 
                    model: OrganisationProductCategory,
                    attributes: []
                },
                {
                    model: ProductPrice,
                    attributes: []
                },
                {
                    model: ProductQuantity,
                    attributes: []
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }).then((all) => {
            if (all) {
                cb(null, { data: all.rows, count: all.count })
            }
        })
    })
}

function getProduct(id, res, cb) {
    return OrganisationProduct.findByPk(id, { include: [ProductPrice, ProductQuantity, ProductConversionRate] }).then((product) => {
        if (!product) {
            cb(sendErrorResponse(res, 404, 'Product not found'));
        } else {
            let productPrice = product.ProductPrices[0] || {};
            let productQuantity = product.ProductQuantities[0] || {};
            let productConversionRate = product.ProductConversionRates[0] || {};
            const productData = {
                id: product.id,
                categoryId: product.categoryId,
                productNumber: product.productNumber,
                type: product.type,
                name: product.name,
                sku: product.sku,
                manufacturer: product.manufacturer,
                description: product.description,
                unitOfMeasure: product.unitOfMeasure,
                unit: product.unit,
                image: product.image,
                imageThumbnail: product.imageThumbnail,
                isActive: product.isActive,
                isTaxable: product.isTaxable,
                requireQuantity: product.requireQuantity,
                isInventory: product.isInventory,
                pricing: productPrice,
                quantity: productQuantity,
                conversionRate: productConversionRate
            };
            cb(null, productData)
        }
    })
}

function addProduct(organisationId, reqData, res, cb) {
    return Organisation.findByPk(organisationId).then((organisation) => {
        if (!organisation) {
            cb(sendErrorResponse(res, 404, 'Organisation not found'));
        }
        if (reqData.categoryId) {
            this.checkCategoryAsync(reqData.categoryId, res);
        } 
        return OrganisationProduct.findOne({ where: { name: reqData.name, organisationId: organisationId } }).then((product) => {
            if (product) {
                cb(sendErrorResponse(res, 400, 'Product already exists'));
            } else {
                const rand = randomInt(0, 1000000);
                const productNumber = "Product #" + rand;
                return OrganisationProduct.create({
                    id: crypto.randomUUID(),
                    productNumber: productNumber,
                    organisationId: organisationId,
                    categoryId: reqData.categoryId,
                    type: reqData.type,
                    name: reqData.name,
                    sku: reqData.sku,
                    manufacturer: reqData.manufacturer,
                    description: reqData.description,
                    unitOfMeasure: reqData.unitOfMeasure,
                    unit: reqData.unit,
                    image: reqData.image,
                    imageThumbnail: reqData.imageThumbnail,
                    isActive: reqData.isActive,
                    isTaxable: reqData.isTaxable,
                    requireQuantity: reqData.requireQuantity,
                    isInventory: reqData.isInventory

                }).then((added) => {
                    return {
                        productId: added.id,
                        organisationId: organisationId
                    };
                })
            }
        }).then((data) => {
            if (reqData.pricing) {
                let pricingData = reqData.pricing;
                return this.addProductPriceAsync(data, pricingData)
            }
        }).then((data) => {
            if (reqData.quantity) {
                let quantityData = reqData.quantity;
                return this.addProductQuantityAsync(data, quantityData)
            }
           
        }).then((data) => {
            if (reqData.conversionRate) {
                let conversionRateData = reqData.conversionRate;
                return this.addProductConversionRateAsync(data, conversionRateData)
            }
            
        }).then((data) => {
            return OrganisationProduct.findOne({
                where: { id: data },
                distinct: true,
                subQuery: false,
                attributes: [
                    'id',
                    'organisationId',
                    'categoryId',
                    'productNumber',
                    'type',
                    'name',
                    'description',
                    'sku',
                    'manufacturer',
                    'unitOfMeasure',
                    'unit',
                    'image',
                    'imageThumbnail',
                    'isActive',
                    'isTaxable',
                    'requireQuantity',
                    'isInventory',
                    [Sequelize.literal('OrganisationProductCategory.name'), 'categoryName'],
                    [Sequelize.literal('ProductPrices.price'), 'price'],
                    [Sequelize.literal('ProductQuantities.stock'), 'stock']
                ],
                include: [
                    {
                        model: OrganisationProductCategory,
                        attributes: []
                    },
                    {
                        model: ProductPrice,
                        attributes: []
                    },
                    {
                        model: ProductQuantity,
                        attributes: []
                    }
                ],
            }).then((product) => {
                return cb(null, product);
            })
            
        });
    })
}

function updateProduct(productId, reqData, res, cb) {
    return OrganisationProduct.findByPk(productId).then((product) => {
        if (!product) {
            return cb(sendErrorResponse(res, 404, 'Product not found'));
        }

        let organisationId = product.organisationId;
        if (reqData.categoryId) {
            this.checkCategoryAsync(reqData.categoryId, res);
        } 
        return OrganisationProduct.findOne({ where: { [Op.and]: [{ organisationId: product.organisationId }, { name: reqData.name }, { id: { [Op.ne]: productId } }] } }).then((exists) => {
            if (exists) {
                cb(sendErrorResponse(res, 400, 'Product name already exists'));
            }
            return OrganisationProduct.update({
                name: reqData.name,
                categoryId: reqData.categoryId,
                type: reqData.type,
                sku: reqData.sku,
                manufacturer: reqData.manufacturer,
                description: reqData.description,
                unitOfMeasure: reqData.unitOfMeasure,
                unit: reqData.unit,
                image: reqData.image,
                imageThumbnail: reqData.imageThumbnail,
                isActive: reqData.isActive,
                isTaxable: reqData.isTaxable,
                requireQuantity: reqData.requireQuantity,
                isInventory: reqData.isInventory

            }, { where: { id: product.id } }).then(() => {
                return {
                    productId: product.id,
                    organisationId: organisationId
                };
            })
        }).then((data) => {
            if (reqData.pricing) {
                let pricingData = reqData.pricing;
                return this.addProductPriceAsync(data, pricingData)
            }
        }).then((data) => {
            if (reqData.quantity) {
                let quantityData = reqData.quantity;
                return this.addProductQuantityAsync(data, quantityData)
            }
        }).then((data) => {
            if (reqData.conversionRate) {
                let conversionRateData = reqData.conversionRate;
                return this.addProductConversionRateAsync(data, conversionRateData)
            }                
        }).then(() => {
            cb(null, 'updated');
        });
    })
}

function deleteProduct(productId, res, cb) {
    return OrganisationProduct.findByPk(productId)
        .then((product) => {
            if (!product) {
                cb(sendErrorResponse(res, 404, 'Product not found'));
            } else {
                const image = product.image;
                const imageThumbnail = product.imageThumbnail;
                return OrganisationProduct.destroy({
                    where: {
                        id: productId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        if (image){
                            deleteS3Object(image);
                        }
                        if (imageThumbnail) {
                            deleteS3Object(imageThumbnail);
                        }
                        
                        cb(null, 'Product deleted successfully');
                    }
                })
            }
        });
}

function checkCategory(categoryId, res, cb){
    return OrganisationProductCategory.findByPk(categoryId).then((category) => {
        if (!category){
            return cb(sendErrorResponse(res, 404, 'Category not found'));
        } else {
            cb(null, true);
        }
    })
}

function addProductQuantity(data, quantityData, cb) {
    if (quantityData !== '') {
        let productId = data.productId;
        let organisationId = data.organisationId;

        quantityData = {
            ...quantityData,
            id: crypto.randomUUID(),
            productId: productId,
            organisationId: organisationId
        };

        return ProductQuantity.destroy({
            where: {
                productId: productId
            }
        }).then(() => {
            return ProductQuantity.create(quantityData).then(() => {
                cb(null, data)
            })
        })
    }
}

function addProductPrice(data, pricingData, cb) {
    
    if (pricingData !== ''){
        let productId = data.productId;
        let organisationId = data.organisationId;

        pricingData = {
            ...pricingData,
            id: crypto.randomUUID(),
            productId: productId,
            organisationId: organisationId
        };
        return ProductPrice.destroy({
            where: {
                productId: productId
            }
        }).then(() => {
            return ProductPrice.create(pricingData).then(() => {
                cb(null, data)
            })
        })
    }
    
} 

function addProductConversionRate(data, conversionRateData, cb) {
    if (conversionRateData !== '') {
        let productId = data.productId;
        let organisationId = data.organisationId;

        conversionRateData = {
            ...conversionRateData,
            id: crypto.randomUUID(),
            productId: productId,
            organisationId: organisationId
        };
        return ProductConversionRate.destroy({
            where: {
                productId: productId
            }
        }).then(() => {
            return ProductConversionRate.create(conversionRateData).then(() => {
                cb(null, productId)
            })
        })
    } 
}

function getProductNotes(productId, res, cb ){
    return OrganisationProduct.findByPk(productId).then((product) => {
        if (!product) {
            return cb(sendErrorResponse(res, 404, 'Product not found'));
        }
        return ProductNote.findAll({where: {productId: productId}}).then((notes) => {
            if(!notes){
                return cb(sendErrorResponse(res, 404, 'Product notes not found'));
            }
            cb(null, notes)
        })
    }
    )
}

function addProductNote(reqData, res, cb){
    return OrganisationProduct.findByPk(reqData.productId).then((product) => {
        if (!product) {
            return cb(sendErrorResponse(res, 404, 'Product not found'));
        } else {
            return ProductNote.create({
                id: crypto.randomUUID(),
                productId: reqData.productId,
                note: reqData.note,
            }).then((added) => {
                cb(null, {
                    id: added.id,
                    note: added.note
                });
            })
        }
    })
}

function deleteProductNote(noteId, res, cb) {
    return ProductNote.findByPk(noteId)
        .then((note) => {
            if (!note) {
                cb(sendErrorResponse(res, 404, 'Note not found'));
            } else {
                return ProductNote.destroy({
                    where: {
                        id: noteId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'Note deleted successfully');
                    }
                })
            }
        });
}

Promise.promisifyAll(module.exports);
