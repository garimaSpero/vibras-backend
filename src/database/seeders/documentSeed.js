const { hash } = require('../../utils/hashing');
const model = require('../../models');
const Constants = require('../../utils/constants');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');
const { OrganisationDocument } = model;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        const numOfUsers = 50;

        // create an array of users with dummy data
        const documents = Array.from({ length: numOfUsers }).map(() => ({
            id: crypto.randomUUID(),
            type: 'my-pdf',
            name: 'sample.pdf_1682065805441',
            file: 'https://vibras-crm.s3.us-east-1.amazonaws.com/Document/sample.pdf_1682065805441',
            organisationId: '4924ab5b-ad1b-44d9-b2f0-0d0777afbe86',
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        console.log('documents', documents);
       
        await OrganisationDocument.bulkCreate(documents);

    },

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

    },
};