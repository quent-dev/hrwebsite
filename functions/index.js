/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Configure your email transport
const transporter = nodemailer.createTransport({
  service: "Gmail", // or another email service
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

exports.sendEmailNotification = functions.firestore
  .document("timeOffRequests/{requestId}")
  .onUpdate((change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: after.userId, // Assuming userId is the email
        subject: `Your Time Off Request has been ${after.status}`,
        text: `Your request for ${after.type} from ${after.startDate.toDate()} to ${after.endDate.toDate()} has been ${after.status}.`,
      };

      return transporter.sendMail(mailOptions)
        .then(() => console.log("Email sent"))
        .catch((error) => console.error("Error sending email:", error));
    }

    return null;
  });