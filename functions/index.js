const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sessionStarted = functions.firestore
  .document("/sessions/{sessionId}")
  .onCreate((change, context) => {
    const sessionId = context.params.sessionId;
    const newValue = change.data();
    // const uid = context.auth.uid;
    const userID = change.data().id;
    // admin
    //     .auth()
    //     .getUser(uid)
    //     .then(() => console.log("Success getting id")).catch(err => console.log('Error', `Cannot get uid due to ${err}`));

    const sessionCreatedBy = newValue.createdBy;

    const devicesCollectionRef = admin
      .firestore()
      .collection("userDevices")
      .where("userId", "==", userID);
    const regToken = devicesCollectionRef.onSnapshot(querySnap => {
      querySnap.forEach(doc => {
        const token = doc.data().token;
        const payload = {
          notification: {
            title: `Session started`,
            body: `Your session is now active`,
            sound: "default"
          },
          data: {
            notification_body: "Your session is now active",
            notification_title: "Session started",
            notification_android_visibility: "1",
            notification_android_priority: "1"
          }
        };
        return admin.messaging().sendToDevice(token, payload);
      });
    });

    console.log("Session is created by/for: ", sessionCreatedBy);
    console.log("Session id is: ", sessionId);
    console.log("Regtoken is: ", regToken);
    return regToken;
  });

exports.sessionEnded = functions.firestore
  .document("/sessions/{sessionId}")
  .onUpdate((change, context) => {
    price = 0;
    totalprice = 0;
    const allValues = change.before.data();
    const sessionId = context.params.sessionId;
    const status = change.after.data().isActive;
    const sessionCreatedBy = allValues.createdBy;
    // const uid = context.auth.uid;
    const userID = change.after.data().id;
    const sessionStartTime = change.after.data().timestampStart;
    const sessionEndTime = change.after.data().timestampEnd;
    const coffeePrice = change.after.data().coffeeTotalOrderPrice;
    var hourStart = sessionStartTime.toDate().getMinutes();
    var hourEnd = sessionEndTime.toDate().getMinutes();
    var timeDifference = hourEnd - hourStart;

    if (timeDifference < 1) {
      price = 100;
    } else if (timeDifference > 1) {
      price = timeDifference * 100;
    }
    totalprice = price + coffeePrice;
    // admin
    //     .auth()
    //     .getUser(uid)
    //     .then(() => console.log("Success getting id")).catch(err => console.log('Error', `Cannot get uid due to ${err}`));

    if (status) {
      msg = console.log("No Token Found");
      return msg;
    } else {
      const devicesCollectionRef = admin
        .firestore()
        .collection("userDevices")
        .where("userId", "==", userID);
      const regToken = devicesCollectionRef.onSnapshot(querySnap => {
        querySnap.forEach(doc => {
          const token = doc.data().token;
          const payload = {
            notification: {
              title: `Session finished`,
              body: `Your session has been terminated & total price is ${totalprice}`,
              sound: "default"
            },
            data: {
              notification_body: `Your session has been terminated & total price is ${totalprice}`,
              notification_title: "Session finished",
              notification_android_visibility: "1",
              notification_android_priority: "1"
            }
          };
          return admin.messaging().sendToDevice(token, payload);
        });
      });

      console.log("Session is created by/for: ", sessionCreatedBy);
      console.log("Session id is: ", sessionId);
      console.log("Regtoken is: ", regToken);
      return regToken;
    }
  });
