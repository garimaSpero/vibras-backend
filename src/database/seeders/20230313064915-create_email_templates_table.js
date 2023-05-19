const model = require('../../models');
const crypto = require('crypto');

const { EmailTemplate } = model;

module.exports =  {

  up: async (queryInterface, Sequelize) => {
    const emailData = [
      { id: crypto.randomUUID(), name: 'Proposal Email', isActive: true },
      { id: crypto.randomUUID(), name: 'Invoice Email', isActive: true },
      { id: crypto.randomUUID(), name: 'Receipt Email', isActive: true },
      { id: crypto.randomUUID(), name: 'Job Re-Scheduled Email', isActive: true },
      { id: crypto.randomUUID(), name: 'Job Re-Scheduled SMS', isActive: true },
      { id: crypto.randomUUID(), name: 'Appointment Scheduled Email', isActive: true },
      { id: crypto.randomUUID(), name: 'Appointment Re-Scheduled Email', isActive: true },
      { id: crypto.randomUUID(), name: 'Appointment Scheduled SMS', isActive: true },
      { id: crypto.randomUUID(), name: 'Appointment Re-Scheduled SMS', isActive: true },
      { id: crypto.randomUUID(), name: 'Payment Request Email', isActive: true },
      { id: crypto.randomUUID(), name: 'Terms and Conditions', isActive: true },
      { id: crypto.randomUUID(), name: 'Invoice Fineprint', isActive: true },
    ];

    await EmailTemplate.bulkCreate(emailData);
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await EmailTemplate.destroy();
  },
};