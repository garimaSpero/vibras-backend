const model = require('../../models');
const crypto = require('crypto');

const { ClientHubSetting } = model;

module.exports =  {

  up: async (queryInterface, Sequelize) => {
    const clientHubData = [
      { id: crypto.randomUUID(), setting: 'Menu visibility', shortName: "Quotes and invoices", description: "Allow clients to navigate to and see a list of all sent quotes and invoices", onSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679296017055_file_client-hub.jpg", offSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679319576329_file_1678696422144_file_unnamed+(1).jpg", isActive: true },
      { id: crypto.randomUUID(), setting: 'Quote approval', shortName: "Require client signatures", description: "Require a signature when approving a quote", onSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679296017055_file_client-hub.jpg", offSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679319576329_file_1678696422144_file_unnamed+(1).jpg", isActive: true },
      { id: crypto.randomUUID(), setting: 'Request changes', shortName: "Clients can request changes", description: "Allow clients to request changes on a sent quote", onSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679296017055_file_client-hub.jpg", offSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679319576329_file_1678696422144_file_unnamed+(1).jpg", isActive: true },
      { id: crypto.randomUUID(), setting: 'Appointments', shortName: "Show scheduled time", description: "Allow clients to see the time for scheduled assessments and visits", onSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679296017055_file_client-hub.jpg", offSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679319576329_file_1678696422144_file_unnamed+(1).jpg", isActive: true },
      { id: crypto.randomUUID(), setting: 'Share', shortName: "shortName", description: "Allow existing clients to log into your client hub by adding the following URL to your website:", onSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679296017055_file_client-hub.jpg", offSrc: "https://vibras-crm.s3.amazonaws.com/organisation/1679319576329_file_1678696422144_file_unnamed+(1).jpg", isActive: true },
    ];

    await ClientHubSetting.bulkCreate(clientHubData);
  },

  down: async (queryInterface, Sequelize) => {
    await ClientHubSetting.destroy();
  },
};