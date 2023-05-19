const adminRouter = require("./adminRouter");
const organisationRouter = require("./Organisation/organisationRouter");
const companySettingsRouter = require("./Organisation/companySettingsRouter");
const userRouter = require("./Organisation/userRouter");
const eventTypeRouter = require("./Organisation/eventTypeRouter");
const productCategory = require("./Organisation/productCategoryRouter");
const product = require("./Organisation/productRouter");
const contact = require("./Organisation/contactRouter");
const appointment = require("./Organisation/appointmentRouter");
const bookingForm = require("./Organisation/bookingForm");
const proposal = require("./Organisation/Proposal");
const document = require("./Organisation/documentRouter");

const customerProposal = require("./Customer/proposalRouter");

const express = require("express");
const { sendErrorResponse } = require("../utils/sendResponse");

const cors = require('cors');

const app = express();
app.use(cors());
const adminCorsOptions = {
    origin: "*",
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
};

module.exports = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.get(`/api`, (req, res) => res.send("Api Running"));
    
    app.use('/api/admin', cors(adminCorsOptions), adminRouter);
    app.use('/api/organisation', organisationRouter);
    app.use('/api/organisation/company-settings', companySettingsRouter);
    app.use('/api/organisation/user', userRouter);
    app.use('/api/organisation/event-type', eventTypeRouter);
    app.use('/api/organisation/category', productCategory);
    app.use('/api/organisation/product', product);

    app.use('/api/organisation/contact', contact);
    app.use('/api/organisation/appointment', appointment);
    app.use('/api/organisation/bookingform', bookingForm);
    app.use('/api/organisation/proposal', proposal);
    app.use('/api/organisation/document', document);

    app.use('/api/customer/proposal', customerProposal);

    app.all('*', (req, res) => sendErrorResponse(res, 404, 'Route does not exist'));
};
