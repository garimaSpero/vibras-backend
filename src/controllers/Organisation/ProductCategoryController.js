'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../utils/sendResponse');

let productCategoryService = require('../../services/Organisation/ProductCategory');

const { validationResult } = require('express-validator');

module.exports = {
    getProductCategories: getProductCategories,
    getProductCategory: getProductCategory,
    addProductCategory: addProductCategory,
    updateProductCategory: updateProductCategory,
    deleteProductCategory: deleteProductCategory
};

function getProductCategories(req, res) {
    let userId = req.userId;
    try {
        const pageSize = parseInt(req.query.pageSize, 10) || 100;
        const page = parseInt(req.query.page, 10) || 1;

        productCategoryService.getProductCategoriesAsync(userId, pageSize, page, res)
            .then((result) => { 
                return sendPaginatedSuccessResponse(res, 200, result.data, 'Successfully', result.total, page, pageSize);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getProductCategory(req, res) {
    let id = req.query.id;
    try {
        productCategoryService.getProductCategoryAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function addProductCategory(req, res){
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productCategoryService.addProductCategoryAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Category added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProductCategory(req, res) {
    let categoryId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productCategoryService.updateProductCategoryAsync(categoryId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Category updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteProductCategory(req, res) {
    let categoryId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productCategoryService.deleteProductCategoryAsync(categoryId, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, {}, result);
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}