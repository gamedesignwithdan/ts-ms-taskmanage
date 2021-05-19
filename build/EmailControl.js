"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailControl = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var google = require('googleapis').google;
var _a = process.env, CLIENT_ID = _a.CLIENT_ID, CLIENT_SECRET = _a.CLIENT_SECRET, EMAIL = _a.EMAIL, REFRESH_TOKEN = _a.REFRESH_TOKEN;
var EmailControl = /** @class */ (function () {
    function EmailControl() {
    }
    EmailControl.getTransporter = function () {
        if (!EmailControl.transporter) {
            var OAuth2 = google.auth.OAuth2;
            var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, "https://developers.google.com/oauthplayground" // Redirect URL
            );
            oauth2Client.setCredentials({
                refresh_token: REFRESH_TOKEN
            });
            var accessToken = oauth2Client.getAccessToken();
            EmailControl.transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: EMAIL,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });
        }
        return EmailControl.transporter;
    };
    EmailControl.send = function (to, subject, html) {
        var transporter = EmailControl.getTransporter();
        var mailOptions = {
            from: EMAIL,
            to: to,
            subject: subject,
            generateTextFromHTML: true,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, response) {
            error ? console.error(error) : console.log(response);
            transporter.close();
        });
    };
    EmailControl.sendWelcomeEmail = function (email, name) {
        var html = "\n        <div style=\"background-color: rgb(160, 160, 255);\">\n            <h1>Welcome " + name + "</h1>\n            <p>\n                We are very happy that you have decided to sign up with us. Welcome to the team!\n            </p>\n        </div>\n        ";
        var subject = "Thank you for joining us!";
        EmailControl.send(email, subject, html);
    };
    EmailControl.sendCancellationEmail = function (email, name) {
        var html = "\n        <div style=\"background-color: rgb(160, 160, 255);\">\n            <h1>Goodbye " + name + "</h1>\n            <p>\n                We are very happy that you decided to sign up with us. We will miss you! You're always welcome to join the team again in the future!\n            </p>\n        </div>\n        ";
        var subject = "Goodbye for now!";
        EmailControl.send(email, subject, html);
    };
    return EmailControl;
}());
exports.EmailControl = EmailControl;
