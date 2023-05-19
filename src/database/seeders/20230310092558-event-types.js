const model = require('../../models');
const crypto = require('crypto');

const { EventType } = model;

module.exports =  {

  up: async (queryInterface, Sequelize) => {
    const eventTypeData = [
      { id: crypto.randomUUID(), name: 'On-Site Estimate', color: "Purple", colorCode: '#6A5AEB', duration: 30 , isDefault: true },
      { id: crypto.randomUUID(), name: 'Project Walkthrough', color: "Salmon", colorCode: "#FF887C", duration: 30, isDefault: true },
      { id: crypto.randomUUID(), name: 'Punch-Out', color: "Orange", colorCode: "#FFB878", duration: 30,isDefault: true },
      { id: crypto.randomUUID(), name: 'Site Visit', color: "Mint", colorCode: "#7AE7BF", duration: 30,isDefault: true },
      { id: crypto.randomUUID(), name: 'Scope Clarification', color: "Light Blue", colorCode: "#14BDFC", duration: 30,isDefault: true },
      { id: crypto.randomUUID(), name: 'Quality Control', color: "Yellow", colorCode: "#FBD75B", duration:30 ,isDefault: true },
      { id: crypto.randomUUID(), name: 'Payment Collection', color: "Green", colorCode: "#51B749", duration: 30,isDefault: true },
      { id: crypto.randomUUID(), name: 'Google Event', isCalendar: true, color: "Gray", colorCode: "#E1E1E1", duration:30,  isDefault: true },
    ];

    await EventType.bulkCreate(eventTypeData);
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await EventType.destroy();
  },
};