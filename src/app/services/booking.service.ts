import { BehaviorSubject, Observable } from "rxjs";
import { Place } from "./../place.model";
import { AlertController } from "@ionic/angular";
import { AdminService } from "src/app/services/admin.service";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "src/app/services/auth.service";
import { Injectable } from "@angular/core";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { uuid } from "uuid";

import * as firebase from "firebase/app";

export interface Booking {
  bookingID: String;
  placeBookedID;
  placeBookedName;
  userBookingID;
  userBookingName;
  userBookingEmail;
  userBookingPhone;
  totalCoffeePrice: number;
  sessionStatus: boolean;
  coffee?;
  finishedBooking: boolean;
  sessionStartTime?: Date;
  sessionEndTime?: Date;
}

@Injectable({
  providedIn: "root"
})
export class BookingService {
  bookingCollection: AngularFirestoreCollection<Booking>;

  private place: Place;
  private seatsAvailable: number = 60;
  private thisDeviceId: string;
  private uniqueId = (Math.floor(Math.random() * 5000000) + 1).valueOf();

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private adminService: AdminService,
    private alertCtrl: AlertController,
    private uniqueDeviceId: UniqueDeviceID
  ) {
    this.bookingCollection = this.afStore.collection("bookings");
  }

  createBooking(placeBookedID, placeBookedName) {
    let currentUser = this.authService.getUser();
    let uniqueBookingID = (
      Math.floor(100000000 + Math.random() * 900000000) + 1
    ).toString();
    const bookingData: Booking = {
      placeBookedID,
      placeBookedName: placeBookedName + " SPIQ",
      bookingID: uniqueBookingID,
      userBookingID: currentUser.uid,
      userBookingName: currentUser.displayName,
      userBookingEmail: currentUser.email,
      userBookingPhone: currentUser.phoneNumber,
      coffee: [],
      totalCoffeePrice: 0,
      sessionStatus: false,
      finishedBooking: false,
      sessionStartTime: new Date(),
      sessionEndTime: null
    };
    return new Promise<any>((resolve, reject) => {
      this.bookingCollection.add(bookingData).then(
        res => {
          this.modifySeatsAvailable(bookingData.placeBookedID);
          this.showAlert(
            "Booked",
            `You have booked ${placeBookedName} successfully! and your booking id is ${uniqueBookingID}`
          );
          resolve(res);
        },
        err => {
          this.showAlert("Error", `${err}`);
          reject(err);
        }
      );
    }).catch(err => this.showAlert("Error", `${err}`));
  }

  modifyOnePlace() {
    const db = firebase.firestore();
    const placesRef = db.collection("places");
    placesRef
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const seats = doc.data().seatsFree - 1;
          const docRef = db.collection("places").doc(doc.id);
          docRef.set(
            {
              seatsFree: seats
            },
            { merge: true }
          );
        });
      })
      .catch(err => console.log(err));
  }

  modifySeatsAvailable(placeID) {
    const db = firebase.firestore();
    const placesRef = db.collection("places").where("placeID", "==", placeID);
    placesRef
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const seats = doc.data().seatsFree - 1;
          const docRef = db.collection("places").doc(doc.id);
          docRef.set(
            {
              seatsFree: seats
            },
            { merge: true }
          );
        });
      })
      .catch(err => console.log(err));
  }

  checkFreeSeats(placeID) {
    const db = firebase.firestore();
    const placesRef = db.collection("places").where("placeID", "==", placeID);
    let seatStatus: boolean;

    return new Observable<boolean>(observer => {
      const status = placesRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const seats = doc.data().seatsFree;
          if (seats > 0) {
            seatStatus = true;
          } else {
            seatStatus = false;
          }
        });
        observer.next(seatStatus);
      });
      return status;
    });
  }
  checkFreeSeatsOnePlace() {
    const db = firebase.firestore();
    const placesRef = db.collection("places");
    let seatStatus: boolean;

    return new Observable<boolean>(observer => {
      const status = placesRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const seats = doc.data().seatsFree;
          if (seats == 0) {
            seatStatus = false;
          } else {
            seatStatus = true;
          }
        });
        observer.next(seatStatus);
      });
      return status;
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
