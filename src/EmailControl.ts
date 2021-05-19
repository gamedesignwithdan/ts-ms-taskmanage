import nodemailer, { Transporter, TransportOptions } from 'nodemailer';
const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, EMAIL, REFRESH_TOKEN } = process.env

export class EmailControl {
    private static transporter: Transporter;

    static getTransporter() {
        if (!EmailControl.transporter) {
            const OAuth2 = google.auth.OAuth2;
    
            const oauth2Client = new OAuth2(
                CLIENT_ID,
                CLIENT_SECRET,
                "https://developers.google.com/oauthplayground" // Redirect URL
            );
    
            oauth2Client.setCredentials({
                refresh_token: REFRESH_TOKEN
            })
    
            const accessToken = oauth2Client.getAccessToken();

            EmailControl.transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                     type: "OAuth2",
                     user: EMAIL, 
                     clientId: CLIENT_ID,
                     clientSecret: CLIENT_SECRET,
                     refreshToken: REFRESH_TOKEN,
                     accessToken: accessToken
                }
            } as TransportOptions)
        }

        return EmailControl.transporter
    }

    static send(to: string, subject: string, html: string) {
        const transporter = EmailControl.getTransporter()

        const mailOptions = {
            from: EMAIL,
            to,
            subject,
            generateTextFromHTML: true,
            html
        }
        transporter.sendMail(mailOptions, (error, response) => {
            error ? console.error(error) : console.log(response)
            transporter.close();
        })
    }

    static sendWelcomeEmail(email: string, name: string) {
        const html = `
        <div style="background-color: rgb(160, 160, 255);">
            <h1>Welcome ${name}</h1>
            <p>
                We are very happy that you have decided to sign up with us. Welcome to the team!
            </p>
        </div>
        `
        const subject = "Thank you for joining us!"

        EmailControl.send(email, subject, html)
    }

    static sendCancellationEmail(email: string, name: string) {
        const html = `
        <div style="background-color: rgb(160, 160, 255);">
            <h1>Goodbye ${name}</h1>
            <p>
                We are very happy that you decided to sign up with us. We will miss you! You're always welcome to join the team again in the future!
            </p>
        </div>
        `
        const subject = "Goodbye for now!"
        EmailControl.send(email, subject, html)
    }
}