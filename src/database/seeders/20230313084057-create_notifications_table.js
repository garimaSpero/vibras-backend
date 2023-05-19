const model = require('../../models');
const crypto = require('crypto');

const { Notification } = model;

module.exports =  {

  up: async (queryInterface, Sequelize) => {
    const notificationData = [
      { id: crypto.randomUUID(), name: 'New Appointment', isActive: true },
      { id: crypto.randomUUID(), name: 'Proposal Accepted', isActive: true },
      { id: crypto.randomUUID(), name: 'Proposal Rejected', isActive: true },
      { id: crypto.randomUUID(), name: 'Proposal Viewed', isActive: true },
      { id: crypto.randomUUID(), name: 'Invoice Viewed', isActive: true },
      { id: crypto.randomUUID(), name: 'Invoice Paid', isActive: true },
    ];

    await Notification.bulkCreate(notificationData);
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await Notification.destroy();
  },
};