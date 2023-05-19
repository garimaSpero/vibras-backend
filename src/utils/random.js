const crypto = require('crypto');

module.exports = {
    generateRandomPassword: generateRandomPassword,
};

function generateRandomPassword() {
    return crypto.randomBytes(10).toString('base64');
}