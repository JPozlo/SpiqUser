import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { SMS } from "@ionic-native/sms/ngx";
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
import { Observable } from "rxjs";
import { User } from "./user.service";

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
  sessionCollection: AngularFirestoreCollection;
  sessions: Observable<Session[]>;
  session;
  coffeePrice = 0;
  isUserActive: boolean;
  user;
  username;
  email;
  isActive;
  isBook;
  image;

  priceUpdateSuccessful: boolean;

  constructor(
    private imgPicker: ImagePicker,
    private sms: SMS,
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
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  // getSessionStatus() {
  //   const db = firebase.firestore();
  //   const user = this.authService.getUser();
  //   const userID = user.uid;
  //   db.collection('users').where('id', '==', userID).onSnapshot(snap => {
  //     snap.forEach(doc => {
  //       let data = doc.data();
  //       let isActive = doc.data().isActive;
  //       this.isUserActive = isActive;
  //     });
  //   }, err => console.log(`Error for testing this is: ${err}`));

  //   const userStatus = this.isUserActive;
  //   return userStatus;
  // }

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
          return false;
          this.showAlert(
            "Sorry!",
            `You cannot make an order unless you are in session`
          );
        }
      )
      .catch(err => this.showAlert("Error", `${err}`));
    return this.priceUpdateSuccessful;
  }

  getCoffeeTotalPrice() {
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
            this.coffeePrice = doc.data().coffeeTotalOrderPrice;
            this.showAlert(
              "Success!",
              `Retrieved total coffee price: ${this.coffeePrice} from firestore`
            );
          });
        },
        err => {
          this.showAlert(
            "Failure!",
            `Error in retrieving total coffee price: ${err}`
          );
        }
      );

    const data = this.coffeePrice;
    return data;
  }

  // updateIsActive(sessionValueStatus: boolean) {
  //   const db = firebase.firestore();
  //   const user = this.authService.getUser();
  //   const userID = user.uid;
  //   db.collection('users').where('id', '==', userID)
  //     .get()
  //     .then(snap => {
  //       snap.forEach(doc => {
  //         const docRef = db.collection('users').doc(doc.id);
  //         docRef.set({ isActive: sessionValueStatus }, { merge: true });
  //       });
  //     }, err => {
  //       this.showAlert('Failure!', `Updating sessionActiveValue failed due to: ${err}`);
  //     });

  // }

  uploadImage(imageURI) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let mydownloadURL = storageRef.getDownloadURL();
      let imageRef = storageRef.child("image").child("imageName");
      this.encodeImageUri(imageURI, function(image64) {
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
    img.onload = function() {
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
