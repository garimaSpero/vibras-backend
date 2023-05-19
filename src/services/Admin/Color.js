'use strict';
let Promise = require('bluebird');
const model = require('../../models');
const { ColorCode } = model;

module.exports = {
    getColors: getColors,
};

function getColors(cb) {
    return ColorCode.findAll().then((colors) => {
        if (!colors) {
            cb(null, []);
        }
        cb(null, colors);
    })
}

Promise.promisifyAll(module.exports);