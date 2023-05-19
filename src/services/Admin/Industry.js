'use strict';
let Promise = require('bluebird');
let model = require('../../models');
const { Industry } = model;

module.exports = {
    getIndustries: getIndustries,
};

function getIndustries(cb) {
    return Industry.findAll().then((all) => {
        if (!all) {
            cb(null, []);
        }
        cb(null, all);
    });
}

Promise.promisifyAll(module.exports);
