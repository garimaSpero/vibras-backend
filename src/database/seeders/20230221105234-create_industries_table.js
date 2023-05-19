const model = require('../../models');
const crypto = require('crypto');

const { Industry } = model;

module.exports =  {
  
  up: async (queryInterface, Sequelize) => {
    const industryData = [
      { id: crypto.randomUUID(), name: 'Laminate Flooring'},
      { id: crypto.randomUUID(), name: 'Painting' },
      { id: crypto.randomUUID(), name: 'Plumbing' },
      { id: crypto.randomUUID(), name: 'Solariums' },
      { id: crypto.randomUUID(), name: 'Tiling' },
      { id: crypto.randomUUID(), name: 'Data Wiring' },
      { id: crypto.randomUUID(), name: 'Wallpapering' },
      { id: crypto.randomUUID(), name: 'Water Heaters' },
    ];
  
    await Industry.bulkCreate(industryData);
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await Industry.destroy();
  },
};