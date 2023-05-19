const { hash } = require('../../utils/hashing');
const model = require('../../models');
const Constants = require('../../utils/constants');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');
const { Contact } = model;

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
        const users = Array.from({ length: numOfUsers }).map(() => ({
            id: crypto.randomUUID(),
            contactNumber: faker.datatype.number({
                'min': 10,
                'max': 50
            }),
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            phone: faker.phone.number(), // generate a fake phone number
            organisationId: '3ff40747-d1fc-4529-89a5-2c0676a3b87b',
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        console.log('users', users);

        await Contact.bulkCreate(users);
      
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