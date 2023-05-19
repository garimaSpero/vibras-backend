const { hash } = require('../../utils/hashing');
const model = require('../../models');
const Constants = require('../../utils/constants');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');
const { User, Role, Permission } = model;

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
            firstName: faker.name.firstName(),
            email: faker.internet.email(), // generate a fake email
            phone: faker.phone.number(), // generate a fake phone number
            organisationId: '3ff40747-d1fc-4529-89a5-2c0676a3b87b',
            roleId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        console.log('users', users);

        await User.bulkCreate(users);
        

       
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