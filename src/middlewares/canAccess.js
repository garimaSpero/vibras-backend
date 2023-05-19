const { sendErrorResponse } = require("../../utils/sendResponse");
const model = require('../models/Organisation');

const { Role, Permission } = model;

module.exports =  (permission) => async (req, res, next) => {
    const access = await Permission.findOne({
        where: { name: permission },
        include: [{ attributes: ['id', 'name'], model: Role, as: 'roles', through: { attributes: [] } }],
    });
    if (await req.userData.hasPermissionTo(access)) {
        return next();
    }
    console.error('You do not have the authorization to access this.');
    return sendErrorResponse(res, 403, 'You do not have the authorization to access this');
};