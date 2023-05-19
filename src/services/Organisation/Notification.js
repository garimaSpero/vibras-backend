'use strict';

let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { User, OrganisationNotification, Notification } = model;
const { Sequelize } = require('sequelize');

module.exports = {
    getNotifications: getNotifications,
    updateNotification: updateNotification
};

function mapToOrganisationNotification(notification, organisationId) {
    return {
        id: crypto.randomUUID(),
        notificationId: notification.id,
        organisationId: organisationId,
        enabled: true
    };
}

function getNotifications(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            return cb(sendErrorResponse(res, 404, 'User not found'));
        }
        let organisationId = user.organisationId;
        return OrganisationNotification.findAll({
            where: { organisationId: organisationId },
            attributes: [
                'id',
                'notificationId',
                'enabled',
                [Sequelize.literal('Notification.name'), 'name'],
            ],
            include: [{ model: Notification, attributes: []}],
            order: [['createdAt', 'DESC']]
        }).then((all) => {
            if (all.length === 0) {
                return Notification.findAll().then((notifications) => {

                    const organisationNotification = notifications.map(obj => mapToOrganisationNotification(obj, organisationId));

                    return OrganisationNotification.bulkCreate(organisationNotification).then(() => {
                        return OrganisationNotification.findAll({
                            where: { organisationId: organisationId }, attributes: [
                                'id',
                                'notificationId',
                                'enabled',
                                [Sequelize.literal('Notification.name'), 'name'],
                            ],
                            include: [{ model: Notification, attributes: [] }],
                            order: [['createdAt', 'DESC']] }).then((added) => {
                            cb(null, added);
                        })
                    })
                })
            } else {
                cb(null, all);
            }
        })
    })
}

function updateNotification(userId, reqBody, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            return cb(sendErrorResponse(res, 404, 'User not found'));
        }
        const organisationId = user.organisationId;

        const notification = reqBody.data;
        return OrganisationNotification.destroy({
            where: {
                organisationId: organisationId
            }
        }).then(function () {
            const data = notification.map(v => ({ ...v, id: crypto.randomUUID(), organisationId: organisationId }))

            return OrganisationNotification.bulkCreate(data).then((data) => {
                cb(null, data);
            })
        })
    })
}

Promise.promisifyAll(module.exports);
