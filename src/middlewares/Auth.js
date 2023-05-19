const { sendErrorResponse } = require('../utils/sendResponse');
const organisation = require('../models');

const { User } = organisation;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

module.exports =  async (req, res, next) => {
    try {
        const token = req.header("authorization");

        if (!token) {
            return res.status(403).send({
                message: "No token provided!"
            });
        }
        const user = await User.findOne({ where: { token: token }, attributes: ['id', 'organisationId'] });

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            if (!user) return sendErrorResponse(res, 404, 'Login Expired, Please login again');
            req.userId = decoded.id;
            req.organisationId = user.organisationId;
            next();
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 401, 'Authentication Failed', e);
    }
};