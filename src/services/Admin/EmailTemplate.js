'use strict';
let Promise = require('bluebird');
const EmailTemplate = require('../../models');


module.exports = {
    getEmailTemplates: getEmailTemplates,
};


function getEmailTemplates(cb) {
    return EmailTemplate.findAll().then((emails) => {
        if (!emails) {
            cb(null, []);
        }
        cb(null, emails);
    })
}

Promise.promisifyAll(module.exports);
