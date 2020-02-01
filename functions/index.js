const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const twilio = require("twilio");

// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const firebaseConfig = functions.config();
const accountSid = firebaseConfig.twilio.sid;
const authToken = firebaseConfig.twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = "+14804268393"; // My Twilio Phone Number

exports.textStatus = functions.firestore
  .document("/sessions/{sessionId}")
  .onCreate((change, context) => {
    const sessionId = context.params.sessionId;
    const newValue = change.data();

    const status = newValue.isActive;
    const textMessage = {
      body: `Current session status: ${status}`,
      to: "+254 710 411246",
      from: twilioNumber
    };

    console.log("Message sent successfully", sessionId);

    return client.messages.create(textMessage);

    // admin
    //   .firestore()
    //   .doc(`/sessions/${sessionId}`)
    //   .onSnapshot(
    //     doc => {
    //       const status = doc.data().isActive;
    //       const textMessage = {
    //         body: `Current session status: ${status}`,
    //         to: "+254 710 411246",
    //         from: twilioNumber
    //       };
    //       return client.messages.create(textMessage);
    //     },
    //     err => console.log("Error sending sms", err)
    //   );
  });

// exports.textStatus = functions.database
//   .ref("/sessions/{sessionId}/isActive")
//   .onUpdate(event => {
//     const sessionId = event.params.sessionId;
//     return admin
//       .database()
//       .ref(`/sessions/${sessionId}`)
//       .once("value")
//       .then(snap => snap.val())
//       .then(session => {
//         const status = session.isActive;
//         const textMessage = {
//           body: `Current session status: ${status}`,
//           to: "+254 710 411246",
//           from: twilioNumber
//         };
//         return client.messages.create(textMessage);
//       })
//       .then(message => console.log(message, "Success"))
//       .catch(err => console.log(err));
//   });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
