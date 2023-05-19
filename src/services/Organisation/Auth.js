'use strict';
const { Op } = require('sequelize');

let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const { sendErrorResponse } = require("../../utils/sendResponse");
const { sendRegistrationEmail, sendPasswordResetEmail } = require("../../utils/emailUtils");
const Constants = require('../../utils/constants');
const { generateRandomPassword } = require("../../utils/random");

const { User, Organisation, Role } = model;
const config = require("../../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { randomInt } = require('crypto');


module.exports = {
    signUp: signUp,
    login: login,
    resetPassword: resetPassword,
    verify: verify
};

function signUp(reqData, res, cb) {
    let phone = reqData.phone;
    let email = reqData.email;
      
    return User.findOne({ where: { [Op.or]: [{ phone }, { email }] } }).then((user) => {
        if(user) {
            cb(null, sendErrorResponse(res, 422, 'User with that email or phone already exists'))
        } else {
            const rand = randomInt(0, 1000000);
            const companyNumber = "Account#" + rand;
            let name = reqData.firstName + ' ' + reqData.lastName;

            return Organisation.create({
                id: crypto.randomUUID(),
                name: name,
                companyNumber: companyNumber,
                businessName: reqData.businessName,
                industryId: reqData.industry,
                noOfEmployee: reqData.employee,
                phone: phone,
                source: reqData.source,
            }).then((org) => {
                if(!org){
                    cb(null, sendErrorResponse(res, 400, 'Something went wrong'))
                }else{
                    return User.create({
                        id: crypto.randomUUID(),
                        firstName: reqData.firstName,
                        lastName: reqData.lastName,
                        email: email,
                        password: bcrypt.hashSync(reqData.password, 8),
                        organisationId: org.id,
                        phone: phone,
                        status: 'active'
                    }).then((user) => {
                        sendRegistrationEmail(email, user.id)
                        return user.id 
                    })
                }
            })
        }

    }).then((userId) => {
        if (!userId) {
            return
        }
        let token = jwt.sign({ id: userId }, config.secret, {
            expiresIn: 86400
        });
                        
        const adminRole = Role.findOne({ where: { name: Constants.ROLE_ADMIN } });
        return User.update({
            token: token,
            roleId: adminRole.id
        }, {
            where: { id: userId },
        }).then(() => {
            return User.findByPk(userId).then((user) => {
                user.addRole(adminRole);
                cb(null, {
                    accessToken: user.token
                })
            })
        })
    })
}

function login(reqData, res, cb) {
    let email = reqData.email;
    return User.findOne({ where: { email: email } }).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 400, 'Incorrect login credentials. Kindly check and try again'))
        }else{
            if (user.status !== 'active') {
                cb(null, sendErrorResponse(res, 400, 'Your account has been suspended. Contact admin'))
            }
            
            if (!user.isVerified) cb(null, sendErrorResponse(res, 400, 'Please verify email address'))
            
            const passwordIsValid = bcrypt.compareSync(
                reqData.password,
                user.password
            );
                        
            if (!passwordIsValid) {
                cb(null, sendErrorResponse(res, 400, 'Invalid Password!'))
            } 

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400
            });

            User.update({ token: token }, { where: { id: user.id } })

            cb(null, { accessToken: token });
        }
    })
}

function resetPassword(reqData, res, cb) {
    return User.findOne({ where: { email: reqData.email }}).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 404, 'Email not found'));
        }else{
            let  password = generateRandomPassword();
            let hasPassword = bcrypt.hashSync(password, 8)
            return User.update({
                password: hasPassword,
            }, {
                where: { id: user.id },
            }).then(() => {
                sendPasswordResetEmail(user.email, password)
                cb(null, 'Reset Password email sent successfully');
            })
        }
    })
}

function verify(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 404, 'Email not found'));
        }
        else{
            if (user.isVerified){
                cb(null, sendErrorResponse(res, 400, 'Email Already verified'));
            }else{
                return User.update({
                    isVerified: true,
                }, {
                    where: { id: userId },
                }).then(() => {
                    cb(null, 'Email verified successfully');
                })
            }
        }
    })
}

Promise.promisifyAll(module.exports);
