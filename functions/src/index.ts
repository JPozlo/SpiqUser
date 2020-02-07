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

export const sessionStarted = functions.firestore
  .document("/sessions/{sessionId}")
  .onCreate((change, context) => {
    const sessionId = context.params.sessionId;
    const newValue = change.data();
    const uid = context.auth?.uid!;
    admin
      .auth()
      .getUser(uid)
      .then(
        () => {
          console.log("Success getting id");
        },
        () => console.log("Failure getting the uid")
      );

    const sessionPlaceId = newValue?.session_place_id;
    const sessionUserEmail = newValue?.session_user_email;

    const devicesCollection = admin.firestore().collection("devices");
    const regToken = devicesCollection.onSnapshot(querySnap => {
      querySnap.forEach(doc => {
        const token = doc.data().token;
        const payload = {
          notification: {
            title: `Booked by ${sessionUserEmail}!!`,
            body: `You have successfully booked a place with ID of ${sessionPlaceId}!`
          }
        };
        return admin.messaging().sendToDevice(token, payload);
      });
    });
    console.log("Session to send information", sessionId);
    console.log("Regtoken is ", regToken);
    return regToken;
  });
