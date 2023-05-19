'use strict';
const { Op } = require('sequelize');

let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { User, OrganisationProductCategory } = model;

module.exports = {
    getProductCategoryCount: getProductCategoryCount,
    getProductCategories: getProductCategories,
    getProductCategory: getProductCategory,
    addProductCategory: addProductCategory,
    updateProductCategory: updateProductCategory,
    deleteProductCategory: deleteProductCategory,
};

function getProductCategoryCount(organisationId, cb){
    return  OrganisationProductCategory.count({
        where: {
            organisationId: organisationId
        }
    }).then((allCount) => {
        cb(null, allCount);
    });
}
function getProductCategories(userId, limit, page, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        let organisationId = user.organisationId;
        
        return OrganisationProductCategory.findAndCountAll({
            where: { organisationId: organisationId },
            distinct: true,
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        }).then((all) => {
            if (all) {
                const categoryData = all.rows;
                const updatedData = categoryData.map((item) => {
                    if (item.measure && item.measure.includes(",")) {
                        item.measure = item.measure.split(",").map(Number);
                    } else {
                        item.measure = [Number(item.measure)];
                    }
                    return item;
                });
                cb(null, { data: updatedData, total: all.count });
            }
        })
    })
}

function getProductCategory(id, res, cb){
    return OrganisationProductCategory.findByPk(id).then((productCategory) => {
        if (!productCategory){ 
            cb(sendErrorResponse(res, 404, 'Category not found'));
        }else{
            let categoryMeasure = productCategory.measure;
            let categoryMeasureArray = [];
            if (categoryMeasure.includes(",")) {
                categoryMeasureArray = categoryMeasure.split(",");
            }else{
                categoryMeasureArray.push(categoryMeasure);
            }
            cb(null, {
                id: productCategory.id,
                name: productCategory.name,
                measure: categoryMeasureArray
            })
        }
    })
}

function addProductCategory(userId, reqData, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        let organisationId = user.organisationId;

        return OrganisationProductCategory.findOne({ where: { name: reqData.name, organisationId: organisationId } }).then((category) => {
            if (category) {
                cb(sendErrorResponse(res, 400, 'Category already exists'));
            } else {
                return OrganisationProductCategory.create({
                    id: crypto.randomUUID(),
                    organisationId: organisationId,
                    name: reqData.name,
                    measure: reqData.measure,

                }).then((added) => {
                    cb(null, {
                        id: added.id,
                        name: added.name,
                        measure: added.measure,
                    });
                })
            }
        })
    })
}

function updateProductCategory(categoryId, reqData, res, cb) {
    return OrganisationProductCategory.findByPk(categoryId).then((category) => {
        if (!category) {
            return cb(sendErrorResponse(res, 404, 'Category type not found'));
        } else {
            return OrganisationProductCategory.findOne({ where: { [Op.and]: [{ organisationId: category.organisationId }, { name: reqData.name }, { id: { [Op.ne]: categoryId }} ]}}).then((exists) => {

                if(exists){
                    cb(sendErrorResponse(res, 400, 'Category name already exists'));
                }else{
                    return OrganisationProductCategory.update({
                        name: reqData.name,
                        measure: reqData.measure

                    }, { where: { id: category.id } }).then(() => {
                        return category.id;
                    })
                }
            }) 
        }
    }).then((categoryId) => {
        return OrganisationProductCategory.findByPk(categoryId).then((category) => {
            cb(null, category);
        })
    })
}

function deleteProductCategory(categoryId, res, cb){
    return OrganisationProductCategory.findByPk(categoryId)
        .then((category) => {
            if (!category) {
                cb(sendErrorResponse(res, 404, 'Category not found'));
            } else {
                return OrganisationProductCategory.destroy({
                    where: {
                        id: categoryId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'Category deleted successfully');
                    }
                })
            }
        });
}

Promise.promisifyAll(module.exports);
