const { hash } = require('../../utils/hashing');
const model = require('../../models');
const Constants = require('../../utils/constants');
const crypto = require('crypto');
const { faker, fake } = require('@faker-js/faker');
const { OrganisationProductCategory } = model;

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
        const caterories = Array.from({ length: numOfUsers }).map(() => ({
            id: crypto.randomUUID(),
            name: faker.name.findName(),
            measure: "1,2,3",
            organisationId: '3ff40747-d1fc-4529-89a5-2c0676a3b87b',
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        console.log('caterories', caterories);

        await OrganisationProductCategory.bulkCreate(caterories);



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