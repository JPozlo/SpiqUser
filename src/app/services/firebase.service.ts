import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { AlertController } from "@ionic/angular";
import { AuthService } from "./auth.service";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import { map } from "rxjs/operators";
import { Observable, pipe, BehaviorSubject, of } from "rxjs";
import { Timestamp } from "@google-cloud/firestore";
// import { FieldValue } from "@google-cloud/firestore";


export interface Session {
  id: string;
  createdBy: string;
  coffeeTotalOrderPrice?: number;
  timestampStart: Timestamp;
  timestampEnd?: Timestamp;
  isActive: boolean;
  placeBookedName: String;
  finalPriceSet: boolean;
  totalPrice: number;
  totalHours: number;
}

export interface Locker {
  lockerID: String;
  storageBooked: boolean;
}
export interface LockersBookingHistory {
  userID: String;
  userName: String;
  lockerID: String;
  finished: boolean;
  userEmail: String;
  uniqueID: String;
  price: number;
  placedItem: boolean;
  timeBooked: firebase.firestore.Timestamp;
  timeItemTaken: firebase.firestore.Timestamp;
}

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  private db = firebase.firestore();
  numb = new BehaviorSubject(0);
  sessionCollection: AngularFirestoreCollection;
  sessions: Observable<Session[]>;
  session;
  locker;
  customSessions: Observable<Session[]>;
  mySessions;
  coffeePrice = 0;
  isUserActive: boolean;
  lockerStatus: boolean;
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
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    private afStore: AngularFirestore,
    private authService: AuthService
  ) {
    this.isUserActive = false;

    this.sessionCollection = this.afStore.collection("sessions");
    this.customSessions = this.sessionCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data;
        const id = a.payload.doc.id;
        const createdBy = a.payload.doc.data().createdBy;
        const coffeeTotalOrderPrice = a.payload.doc.data().coffeeTotalOrderPrice;
        const timestampStart = a.payload.doc.data().timestampStart;
        const timestampEnd = a.payload.doc.data().timestampEnd;
        const isActive = a.payload.doc.data().isActive;
        const placeBookedName = a.payload.doc.data().placeBookedName;
        const totalPrice = a.payload.doc.data().totalPrice;
        const finalPriceSet = a.payload.doc.data().finalPriceSet;
        const totalHours = a.payload.doc.data().totalHours;
        return {
          id,
          createdBy,
          coffeeTotalOrderPrice,
          timestampStart,
          timestampEnd,
          isActive,
          placeBookedName,
          totalPrice,
          finalPriceSet,
          totalHours,
          ...data
        };
      });
    })
    );
  }

  addToLockerHistory(lockerID, uniqueID) {
    const userData = this.authService.getUser();
    const historyRef = this.db.collection("lockersBookingHistory").doc();
    historyRef.set({
      userID: userData.uid,
      userEmail: userData.email,
      userName: userData.displayName,
      lockerID: lockerID,
      price: 0,
      finished: false,
      uniqueID: uniqueID,
      timeBooked: firebase.firestore.Timestamp.now(),
      timeItemTaken: null
    }, { merge: true }).then(res => console.log("Successfully added to locker history")).catch(err => {
      console.log("Error adding to locker history below")
      console.dir(err)
    })

  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  lockerDataSet(docNumber) {
    const customData: Locker = {
      lockerID: docNumber,
      storageBooked: false,
    }
    return customData;
  }

  getLockerHistory() {
    const user = this.authService.getUser();
    const userID = user.uid;
    const lockerRef = this.afStore.collection<LockersBookingHistory>("lockersBookingHistory", ref => ref.where("finished", "==", true).where("userID", "==", userID));
    const locker$: Observable<LockersBookingHistory[]> = lockerRef.valueChanges().pipe(
      map(lockers => {
        console.log("Booked Lockers", lockers);
        return lockers;
      })
    );
    return locker$;
  }

  bookLocker(lockerID) {
    const userData = this.authService.getUser();
    const lockerRef = this.db.collection("lockers").doc(lockerID);
    const bookPromise = lockerRef.set({
      storageBooked: true,
      price: 0,
      placedItem: false
    }, { merge: true }).then(res => console.log("Successfully booked locker")).catch(err => {
      console.log("Error booking locker below")
      console.dir(err)
    })
    return bookPromise;

  }

  getFreeLockers() {
    const lockerRef = this.afStore.collection<Locker>("lockers", ref => ref.where("storageBooked", "==", false));

    const locker$: Observable<Locker[]> = lockerRef.valueChanges().pipe(
      map(lockers => {
        console.log("Active Bookings ", lockers);
        return lockers;
      })
    );

    return locker$;
  }

  addLocker() {
    const batch = this.db.batch();
    for (var i = 1; i <= 60; i++) {
      var docNo = i.toString();
      var lockerRef = this.db.collection("lockers").doc(docNo);
      batch.set(lockerRef, this.lockerDataSet(docNo), { merge: true })
    }
    batch.commit().then(res => {
      console.log("Successfully added lockers", res)
    }).catch(err => {
      console.log("Error adding lockers")
      console.dir(err)
    })

  }

  getAllTimes() {
    return this.customSessions;
  }

  // Get history of sessions
  getUserSessions() {
    const user = this.authService.getUser();
    const userID = user.uid;

    const myRef = this.db
      .collection("sessions")
      .where("id", "==", userID)
      .where("isActive", "==", false);

    let myarray: any[] = [];

    return new Observable<Session[]>(observer => {
      const sessions = myRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.session = doc.data();
          console.log("Sessions", this.session);
          myarray.push(this.session);
        });
        observer.next(myarray);
      });
      return sessions;
    });
  }

  // Update the user coffee ordered to admin side in booking DB
  updateBookingCoffeeValues(coffee, coffeePrice) {
    const user = this.authService.getUser();
    const userID = user.uid;
    this.db.collection("bookings")
      .where("userBookingID", "==", userID)
      .where("finishedBooking", "==", false)
      .where("sessionStatus", "==", true)
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const docRef = this.db.collection("bookings").doc(doc.id);
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
              console.log("Success", `Updated coffee price successfuly`); // Replace with crashlytics data
            })
            .catch(err => {
              console.log("Success", `Updated coffee price successfuly`);
              this.showAlert("Error", `${err}`);
            });
        });
      })
      .catch(err => {
        console.log("Success", `Updated coffee price successfuly`);
        this.showAlert("Error", `${err}`);
      });
  }

  // Update the coffee price in the session DB
  updateCoffeeSession(coffeePrice) {
    const user = this.authService.getUser();
    const userID = user.uid;
    // let timestart: Timestamp;
    // timestart.toDate().getMinutes();

    this.db.collection("sessions")
      .where("isActive", "==", true)
      .where("id", "==", userID)
      .get()
      .then(
        snap => {
          snap.forEach(doc => {
            const userState = doc.data().coffeeTotalOrderPrice;
            const docRef = this.db.collection("sessions").doc(doc.id);
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
    const user = this.authService.getUser();
    const userID = user.uid;

    const myRef = this.db.collection("users").where("id", "==", userID);
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
    const user = this.authService.getUser();
    const userID = user.uid;

    const myRef = this.db
      .collection("bookings")
      .where("userBookingID", "==", userID)
      .where("finishedBooking", "==", false)
      .where("sessionStatus", "==", true);

    return new Observable(observer => {
      const price = myRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.coffeePrice = doc.data().totalCoffeePrice;
        });
        observer.next(this.coffeePrice);
      });
      return price;
    });
  }
}
