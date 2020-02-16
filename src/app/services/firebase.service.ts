import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { AlertController } from "@ionic/angular";
import { AuthService } from "./auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from "@ionic-native/file-transfer/ngx";

import * as firebase from "firebase/app";
import { map } from "rxjs/operators";
import { Observable, pipe, BehaviorSubject, of } from "rxjs";
import { User } from "./user.service";
import { Timestamp } from '@google-cloud/firestore';
// import { FieldValue } from "@google-cloud/firestore";

export interface Session {
  id: string;
  createdBy: string;
  coffeeTotalOrderPrice?: number;
  timestampStart: Date;
  timestampEnd?: Date;
  isActive: boolean;
}

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  numb = new BehaviorSubject(0);
  sessionCollection: AngularFirestoreCollection;
  sessions: Observable<Session[]>;
  session;
  customSessions: Observable<Session[]>;
  mySessions;
  coffeePrice = 0;
  isUserActive: boolean;
  user;
  username;
  email;
  isActive;
  isBook;
  image;

  timeStart;
  timeStop;

  userSessionData;

  priceUpdateSuccessful: boolean;

  constructor(
    private imgPicker: ImagePicker,
    private crop: Crop,
    private fileTransfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.isUserActive = false;

    this.sessionCollection = this.afStore.collection("sessions");
    this.customSessions = this.sessionCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data;
          const id = a.payload.doc.id;
          const createdBy = a.payload.doc.data().createdBy;
          const coffeeTotalOrderPrice = a.payload.doc.data().coffeeTotalOrderPrice;
          const timestampStart = a.payload.doc.data().timestampStart;
          const timestampEnd = a.payload.doc.data().timestampEnd;
          const isActive = a.payload.doc.data().isActive;
          return {
            id,
            createdBy,
            coffeeTotalOrderPrice,
            timestampStart,
            timestampEnd,
            isActive,
            ...data
          };
        });
      })
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  getAllTimes() {
    return this.customSessions;
  }

  // Get the hourly total price
  getStartTime() {
    const db = firebase.firestore()

    const user = this.authService.getUser();
    const userID = user.uid;


    const myRef = db.collection("sessions")
      .where("isActive", "==", true)
      .where("id", "==", userID)

    return new Observable<Timestamp>(observer => {
      const time = myRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.timeStart = doc.data().timestampStart;
        });
        observer.next(this.timeStart);
      })
      return time;
    });
  }

  getEndTime() {
    const db = firebase.firestore()

    const user = this.authService.getUser();
    const userID = user.uid;


    const myRef = db.collection("sessions")
      .where("timestampEnd", "==", !null)
      .where("id", "==", userID)

    return new Observable<Timestamp>(observer => {
      const time = myRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.timeStop = doc.data().timestampEnd;
        });
        observer.next(this.timeStop);
      })
      return time;
    });

  }

  // Get history of sessions
  getUserSessions() {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;

    const myRef = db
      .collection("sessions")
      .where("id", "==", userID)
      .where("isActive", "==", false);

    let myarray: any[] = [];

    return new Observable<Session[]>(observer => {
      const sessions = myRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.session = doc.data();
          console.log("Sessions", this.session);
          myarray.push(this.session)
        });
        observer.next(myarray);
      })
      return sessions;
    });
  }

  // Update the user coffee ordered to admin side in booking DB
  updateBookingCoffeeValues(coffee, coffeePrice) {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;
    db.collection("bookings")
      .where("userBookingID", "==", userID)
      .where("finishedBooking", "==", false)
      .where("sessionStatus", "==", true)
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const docRef = db.collection("bookings").doc(doc.id);
          const oldCoffeePrice = doc.data().totalCoffeePrice;
          const newCoffeePriceTotal = oldCoffeePrice + coffeePrice;
          docRef
            .set(
              {
                coffee: firebase.firestore.FieldValue.arrayUnion(...coffee),
                totalCoffeePrice: newCoffeePriceTotal
              },
              { merge: true }
            )
            .then(merged => {
              console.log('Success', `Updated coffee price successfuly`); // Replace with crashlytics data
            })
            .catch(err => {
              console.log('Success', `Updated coffee price successfuly`)
              this.showAlert('Error', `${err}`);
            }
            );
        });
      })
      .catch(err => {
        console.log('Success', `Updated coffee price successfuly`);
        this.showAlert('Error', `${err}`);
      });
  }

  // Update the coffee price in the session DB
  updateCoffeeSession(coffeePrice) {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;
    db.collection("sessions")
      .where("isActive", "==", true)
      .where("id", "==", userID)
      .get()
      .then(
        snap => {
          snap.forEach(doc => {
            const userState = doc.data().coffeeTotalOrderPrice;
            const docRef = db.collection("sessions").doc(doc.id);
            const newCoffeePriceTotal = userState + coffeePrice;
            docRef
              .set(
                { coffeeTotalOrderPrice: newCoffeePriceTotal },
                { merge: true }
              )
              .then(
                success => {
                  this.priceUpdateSuccessful = true;
                },
                err => {
                  this.priceUpdateSuccessful = false;
                }
              );
          });
        },
        err => {
          this.priceUpdateSuccessful = false;
          this.showAlert(
            "Sorry!",
            `You cannot make an order unless you are in session`
          );
        }
      )
      .catch(err => this.showAlert("Error", `${err}`));
    return this.priceUpdateSuccessful;
  }

  // Check session status to use in coffee checkout
  getCurrentSessionStatus() {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;

    const myRef = db.collection('users').where('id', '==', userID);
    return new Observable<boolean>(observer => {
      const status = myRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.isUserActive = doc.data().isSessionActive;
        });
        observer.next(this.isUserActive);
      });
      return status;
    });

  }

  // Get the total coffee price for displaying to the user
  getCoffeeTotalPrice() {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;

    const myRef = db.collection("bookings")
      .where("userBookingID", "==", userID)
      .where("finishedBooking", "==", false)
      .where("sessionStatus", "==", true);

    return new Observable(observer => {
      const price = myRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.coffeePrice = doc.data().totalCoffeePrice;
        });
        observer.next(this.coffeePrice);
      })
      return price;
    });
  }

  uploadImage(imageURI) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let mydownloadURL = storageRef.getDownloadURL();
      let imageRef = storageRef.child("image").child("imageName");
      this.encodeImageUri(imageURI, function (image64) {
        imageRef.putString(image64, "data_url").then(
          snapshot => {
            const tokenId = this.authService.getUser().subscribe(data => {
              const id = data.id;
              const email = data.email;
              const username = data.email.split("@gmail.com");
              const tokenId = data.getToken();
              const imageUrl = mydownloadURL;
              const mydata = {
                id,
                email,
                tokenId,
                imageUrl
              };
              this.userCollection.add(mydata);
            });
          },
          err => {
            reject(err);
          }
        );
      });
    });
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  }
}
