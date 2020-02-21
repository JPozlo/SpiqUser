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
    thetotalprice = 0;
    const allValues = change.before.data();
    const sessionId = context.params.sessionId;
    const status = change.after.data().isActive;
    const sessionCreatedBy = allValues.createdBy;
    // const uid = context.auth.uid;
    const userID = change.after.data().id;
    const coffeePrice = change.after.data().coffeeTotalOrderPrice;
    const sessionStartTime = change.after.data().timestampStart;

    function setFinalPrice(price) {
      const sessionCollectionRef = admin
        .firestore()
        .collection("sessions")
        .where("id", "==", userID)
        .where("finalPriceSet", "==", false);
      const updateSession = sessionCollectionRef.get().then(
        snap => {
          snap.forEach(doc => {
            const docRef = admin
              .firestore()
              .collection("sessions")
              .doc(doc.id);
            docRef
              .set(
                {
                  totalPrice: price,
                  finalPriceSet: true
                },
                { merge: true }
              )
              .then(res => {
                console.log("Total price update successful");
                return res;
              })
              .catch(err => {
                console.log(`Total price update failed: ${err}`);
                return err;
              });
          });
          return null;
        },
        err => console.log(`Error getting session collection reference: ${err}`)
      );
      return updateSession;
    }

    // admin
    //     .auth()
    //     .getUser(uid)
    //     .then(() => console.log("Success getting id")).catch(err => console.log('Error', `Cannot get uid due to ${err}`));

    if (status) {
      msg = console.log("No Token Found");
      return msg;
    } else {
      const sessionEndTime = change.after.data().timestampEnd;

      var hourStart = sessionStartTime.seconds / 3600;
      var hourEnd = sessionEndTime.seconds / 3600;
      var timeDifference = Math.ceil(hourEnd - hourStart);
      console.log("Time difference in hours", timeDifference);
      price = timeDifference * 100;
      thetotalprice = price + coffeePrice;
      setFinalPrice(thetotalprice);

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
              body: `Your session has been terminated & total price is KSH ${thetotalprice}.00`,
              sound: "default"
            },
            data: {
              notification_body: `Your session has been terminated & total price is KSH ${thetotalprice}.00`,
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
