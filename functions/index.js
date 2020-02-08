const functions = require('firebase-functions');
const admin = require("firebase-admin");
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
        const uid = context.auth.uid;
        // admin
        //     .auth()
        //     .getUser(uid)
        //     .then(() => console.log("Success getting id")).catch(err => console.log('Error', `Cannot get uid due to ${err}`));

        const sessionCreatedBy = newValue.createdBy;

        const devicesCollectionRef = admin.firestore().collection("userDevices").where('userId', '==', uid);
        const regToken = devicesCollectionRef.onSnapshot(querySnap => {
            querySnap.forEach(doc => {
                const token = doc.data().token;
                const payload = {
                    notification: {
                        title: `Session started`,
                        body: `Your session is now active`
                    }
                };
                return admin.messaging().sendToDevice(token, payload);
            })
        })

        console.log("Session is created by/for: ", sessionCreatedBy);
        console.log("Session id is: ", sessionId);
        console.log("Regtoken is: ", regToken);
        return regToken;
    });

exports.sessionEnded = functions.firestore.document('/sessions/{sessionId}').onUpdate((change, context) => {
    const allValues = change.before.data();
    const sessionId = context.params.sessionId;
    const status = change.after.data().isActive;
    const sessionCreatedBy = allValues.createdBy;
    // const uid = context.auth.uid;
    // admin
    //     .auth()
    //     .getUser(uid)
    //     .then(() => console.log("Success getting id")).catch(err => console.log('Error', `Cannot get uid due to ${err}`));

    if (status) {
        return;
    } else {
        const devicesCollectionRef = admin.firestore().collection("userDevices").where('userId', '==', sessionId);
        const regToken = devicesCollectionRef.onSnapshot(querySnap => {
            querySnap.forEach(doc => {
                const token = doc.data().token;
                const payload = {
                    notification: {
                        title: `Session ended`,
                        body: `Your session is now active`
                    }
                };
                return admin.messaging().sendToDevice(token, payload);
            })
        })

        console.log("Session is created by/for: ", sessionCreatedBy);
        console.log("Session id is: ", sessionId);
        console.log("Regtoken is: ", regToken);
        return regToken;
    }
});