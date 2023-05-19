'use strict';
let Promise = require('bluebird');
const model = require('../../models');
const { sendErrorResponse } = require("../../utils/sendResponse");
const crypto = require('crypto');
const { Sequelize } = require('sequelize');

const { User, ClientHubSetting, OrganisationClientHubSetting } = model;

module.exports = {
    getClientHubSettings: getClientHubSettings,
    updateClientHubSettings: updateClientHubSettings
};

function getClientHubSettings(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 404, 'User not found'));
        } else {
            let organisationId = user.organisationId;
            return OrganisationClientHubSetting.findAll({
                where: { organisationId: organisationId },
                attributes: [
                    'id',
                    'settingId',
                    [Sequelize.literal('isEnabled'), 'enabled'],
                    [Sequelize.literal('ClientHubSetting.setting'), 'name'],
                    [Sequelize.literal('ClientHubSetting.shortName'), 'shortName'],
                    [Sequelize.literal('ClientHubSetting.description'), 'description'],
                    [Sequelize.literal('ClientHubSetting.onSrc'), 'onSrc'],
                    [Sequelize.literal('ClientHubSetting.offSrc'), 'offSrc'],
                ],
                include: [{
                    model: ClientHubSetting,
                    attributes: []
                }],
                order: [['createdAt', 'DESC']]
                }).then((orgClientHub) => {
                if (orgClientHub.length === 0) {
                    return ClientHubSetting.findAll().then((allSettings) => {
                        const organisationSettings = allSettings.map(obj => ({ id: crypto.randomUUID(), organisationId: organisationId, settingId: obj.id, isEnabled: true }));
                        return OrganisationClientHubSetting.bulkCreate(organisationSettings).then(() => {
                            return OrganisationClientHubSetting.findAll({
                                where: { organisationId: organisationId },
                                attributes: [
                                    'id',
                                    'settingId',
                                    [Sequelize.literal('isEnabled'), 'enabled'],
                                    [Sequelize.literal('ClientHubSetting.setting'), 'name'],
                                    [Sequelize.literal('ClientHubSetting.shortName'), 'shortName'],
                                    [Sequelize.literal('ClientHubSetting.description'), 'description'],
                                    [Sequelize.literal('ClientHubSetting.onSrc'), 'onSrc'],
                                    [Sequelize.literal('ClientHubSetting.offSrc'), 'offSrc'],
                                ],
                                include: [{
                                    model: ClientHubSetting,
                                    attributes: []
                                }],
                                order: [['createdAt', 'DESC']]
                            }).then((added) => {
                                cb(null, added);
                            })
                        })
                    });
                } else {
                    cb(null, orgClientHub);
                }
            })
        }
    })
}

function updateClientHubSettings(userId, reqBody, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            return cb(null, sendErrorResponse(res, 404, 'User not found'));
        } else {
            let organisationId = user.organisationId;

            return OrganisationClientHubSetting.destroy({
                where: {
                    organisationId: organisationId
                }
            }).then(function () {
                let settingsData = reqBody.data;
                const organisationSettings = settingsData.map(obj => ({ id: crypto.randomUUID(), organisationId: organisationId, settingId: obj.settingId, isEnabled: obj.enabled }));

                return OrganisationClientHubSetting.bulkCreate(organisationSettings).then(() => {
                    return OrganisationClientHubSetting.findAll({ where: { organisationId: organisationId }, include: ClientHubSetting }, {
                        order: [["settingId", "DESC"]],
                    }).then((added) => {

                        let allClientHubSettings = added.map(obj => ({ id: obj.id, settingId: obj.settingId, setting: obj.ClientHubSetting.setting, shortName: obj.ClientHubSetting.shortName, description: obj.ClientHubSetting.description, enabled: obj.isEnabled, onSrc: obj.ClientHubSetting.onSrc, offSrc: obj.ClientHubSetting.offSrc }));
                        cb(null, allClientHubSettings);
                    })
                })
            })
        }
    })
}


Promise.promisifyAll(module.exports);
