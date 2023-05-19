const sendErrorResponse = (res, code, errorMessage, e = null) => res.status(code).send({
    status: 'error',
    message: errorMessage,
    e: e?.toString(),
});

const sendSuccessResponse = (res, code, data, message = 'Successful', count = 0) => res.status(code).send({
    status: 'success',
    data,
    message,
    count
});
const sendPaginatedSuccessResponse = (res, code, data, message = 'Successful', count = 0, page = 1, pageSize = 10) => res.status(code).send({
    status: 'success',
    data,
    message,
    count,
    page,
    pageSize
});

module.exports = {
    sendErrorResponse,
    sendSuccessResponse,
    sendPaginatedSuccessResponse
};
