'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../utils/sendResponse');

let productService = require('../../services/Organisation/Product');

const { validationResult } = require('express-validator');

module.exports = {
    getProducts: getProducts,
    getProduct: getProduct,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getProductNotes: getProductNotes,
    addProductNote: addProductNote,
    deleteProductNote: deleteProductNote,
    saveNoteImage: saveNoteImage
};

function getProducts(req, res) {
    let organisationId = req.organisationId;
    try {
        const pageSize = parseInt(req.query.pageSize, 10) || 100;
        const page = parseInt(req.query.page, 10) || 1;

        productService.getProductsAsync(organisationId, pageSize, page, res)
            .then((result) => {
                return sendPaginatedSuccessResponse(res, 200, result.data, 'Successful', result.count, page, pageSize);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getProduct(req, res) {
    let id = req.query.id;
    try {
        productService.getProductAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function addProduct(req, res) {
    let organisationId = req.organisationId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productService.addProductAsync(organisationId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Product added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProduct(req, res) {
    let productId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productService.updateProductAsync(productId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Product updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteProduct(req, res) {
    let productId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productService.deleteProductAsync(productId, res)
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

function getProductNotes(req, res) {
    let productId = req.query.id;
    try {
        productService.getProductNotesAsync(productId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Successfull');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function addProductNote(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productService.addProductNoteAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Product note added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteProductNote(req, res) {
    let noteId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        productService.deleteProductNoteAsync(noteId, res)
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

function saveNoteImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
        return sendSuccessResponse(res, 201, { fileName: req.originalUrl, thumbnail: req.resizedUrl }, 'Image uploaded successfully');
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}