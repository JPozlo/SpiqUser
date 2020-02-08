import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import * as cors from "cors";

// cors({ origin: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

admin.initializeApp(functions.config().firebase);

// export const helloWorld = functions.https.onRequest((request, response) => {
//     response.setHeader('Access-Control-Allow-Origin', '*');
//     response.send("Hello from Firebase!");

// });

export const sendBooking = functions.https.onRequest((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const msg = req.body;
  res.send(msg);
  console.log("Data/ msg is", msg);
});
