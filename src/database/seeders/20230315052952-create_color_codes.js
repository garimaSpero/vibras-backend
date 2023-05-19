const model = require('../../models');
const crypto = require('crypto');

const { ColorCode } = model;

module.exports =  {

  up: async (queryInterface, Sequelize) => {
    const colorCodesData = [
      { id: crypto.randomUUID(), color: 'Purple', colorCode: "#6A5AEB" },
      { id: crypto.randomUUID(), color: 'Red', colorCode: "#DC2127" },
      { id: crypto.randomUUID(), color: 'Salmon', colorCode: "#FF887C" },
      { id: crypto.randomUUID(), color: 'Orange', colorCode: "#FFB878" },
      { id: crypto.randomUUID(), color: 'Yellow', colorCode: "#FBD75B" },
      { id: crypto.randomUUID(), color: 'Mint', colorCode: "#7AE7BF" },
      { id: crypto.randomUUID(), color: 'Green', colorCode: "#51B749" },
      { id: crypto.randomUUID(), color: 'Dark Blue', colorCode: "#5484ED" },
      { id: crypto.randomUUID(), color: 'Light Blue', colorCode: "#14BDFC" },
      { id: crypto.randomUUID(), color: 'Pink', colorCode: "#DBADFF" },
      { id: crypto.randomUUID(), color: 'Gray', colorCode: "#E1E1E1" },
    ];

    await ColorCode.bulkCreate(colorCodesData);
  },

  down: async (queryInterface, Sequelize) => {
    await ColorCode.destroy();
  },
};