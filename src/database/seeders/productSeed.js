const { hash } = require('../../utils/hashing');
const model = require('../../models');
const Constants = require('../../utils/constants');
const crypto = require('crypto');
const { faker, fake } = require('@faker-js/faker');
const { OrganisationProduct } = model;

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
        const products = Array.from({ length: numOfUsers }).map(() => ({
            id: crypto.randomUUID(),
            categoryId: '21469b17-81e3-4fe7-bcd8-6a3a077c2bfb',
            productNumber: faker.datatype.number({
                'min': 10,
                'max': 50
            }),
            type: 'product',
            name: faker.commerce.productName(),
            organisationId: '4924ab5b-ad1b-44d9-b2f0-0d0777afbe86',
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        console.log('products', products);

        await OrganisationProduct.bulkCreate(products);



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