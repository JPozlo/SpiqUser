import { BehaviorSubject } from "rxjs";
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

export interface Booking {
  placeBookedID;
  placeBookedName;
  actualBookingID;
  userBookingID;
  userBookingName;
  userBookingEmail;
  userBookingPhone;
  sessionStatus: boolean;
  coffee?;
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

    // this.setPlaceData();
    // this.getUniqueDeviceID();
  }

  createBooking(placeBookedID, placeBookedName) {
    let currentUser = this.authService.getUser();
    let uniqueBookingID = (Math.floor(Math.random() * 1000) + 1).toString();
    return new Promise<any>((resolve, reject) => {
      this.bookingCollection
        .add({
          placeBookedID,
          placeBookedName,
          actualBookingID: uniqueBookingID,
          userBookingID: currentUser.uid,
          userBookingName: currentUser.displayName,
          userBookingEmail: currentUser.email,
          userBookingPhone: currentUser.phoneNumber,
          coffee: [],
          sessionStatus: false
        })
        .then(
          res => {
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

  getUniqueDeviceID() {
    return this.uniqueDeviceId
      .get()
      .then(uuid => {
        this.thisDeviceId = uuid;
      })
      .catch(err => console.log(err));
  }

  bookPlace(placeId: string) {
    let currentUser = this.authService.getUser();
    if (this.place.getSeatsAvailable() > 0) {
      return new Promise<any>((resolve, reject) => {
        return this.afStore
          .collection<any>("bookings")
          .add({
            id: (Math.floor(Math.random() * 100) + 1).toString(),
            bookedBy: currentUser.email,
            uniqueId: this.uniqueId,
            deviceId: Object.assign({}, this.thisDeviceId),
            createdAt: new Date()
          })
          .then(res => {
            this.seatsAvailable -= 1;
            this.showAlert(
              "Booked",
              `You have booked ${placeId} successfully! and your unique id is ${this.uniqueId}`
            );
            resolve(res);
            console.log(`The response of currentUser subscription is ${res}`);
          });
      });
    }

    this.showAlert(
      "Unsuccesful",
      "The seats are all occupied! Try our other rooms."
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

  timeSession(hrs: number) {
    let randToken = Math.floor(Math.random() * 10000) + 1;

    const hoursToMilli = hrs * 3600000;

    setTimeout(() => {
      this.showAlert("Expiration", "Your session has expired");
      randToken = null;
    }, hoursToMilli);

    this.seatsAvailable = this.place.getSeatsAvailable();

    this.seatsAvailable += 1;
  }
}
