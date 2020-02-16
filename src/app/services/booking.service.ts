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
    const bookingData = {
      placeBookedID,
      placeBookedName,
      actualBookingID: uniqueBookingID,
      userBookingID: currentUser.uid,
      userBookingName: currentUser.displayName,
      userBookingEmail: currentUser.email,
      userBookingPhone: currentUser.phoneNumber,
      coffee: [],
      totalCoffeePrice: 0,
      sessionStatus: false,
      finishedBooking: false,
      sessionStartTime: null,
      sessionEndTime: null
    };
    return new Promise<any>((resolve, reject) => {
      this.bookingCollection.add(bookingData).then(
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

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
