require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
};

const sendEmail = async (emailOptions) => {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
};

function sendRegistrationEmail(email, userId) {
    try {
        let url = 'https://vibras-cf75e.web.app/verify/' + userId;
        sendEmail({
            subject: "Registration Mail",
            text: 'You have Registered successfully, Please vefiry your email by clicking on below link',
            html: '<a href=' + url + '><button> Verify </button> </a>',
            to: email,
            from: process.env.EMAIL
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function sendPasswordResetEmail(email, password) {
    try {

        sendEmail({
            subject: "Reset Password Mail",
            text: 'We have generated a temporary password for your account, which you can use to log in and reset your password.Temporary Password: ' + password + ' Please log in to your account using the temporary password and follow the instructions to reset your password.Please note that this temporary password is valid for a limited time and should be changed as soon as possible for security reasons.If you did not request a password reset or have any concerns about the security of your account, please contact our support team immediately.',
            to: email,
            from: process.env.EMAIL
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function sendProposalEmail(data) {
    try {
        const email = data?.dataValues?.ContactProposal?.dataValues?.Contact?.dataValues?.email;
        const receiverName = data?.dataValues?.ContactProposal?.dataValues?.Contact?.dataValues?.firstName + ' ' + data?.dataValues?.ContactProposal?.dataValues?.Contact?.dataValues?.lastName;
        const senderName = data?.dataValues?.User?.dataValues?.firstName + ' ' + data?.dataValues?.User?.dataValues?.lastName;
        const companyName = data?.dataValues?.Organisation?.dataValues?.businessName;
        const url = 'https://vibras-cf75e.web.app/accept-proposal/' + data.dataValues.id

        sendEmail({
            subject: "Proposal",
            html: '<html >Hi ' + receiverName + ',Please see the attached quote and click the button below to accept.Feel free to let us know if you have any questions! <br><br> <a href=' + url + '><button> View Proposal </button> </a><br><br><p>Thanks,' + senderName + ' </p><p>' + companyName + '</p> </html>',
            to: email,
            from: process.env.EMAIL
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

module.exports = {
    sendRegistrationEmail: sendRegistrationEmail,
    sendPasswordResetEmail: sendPasswordResetEmail,
    sendProposalEmail: sendProposalEmail
};

