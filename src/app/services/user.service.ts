import { AlertController } from "@ionic/angular";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

import { resolve } from "url";
import { reject } from "q";
import { FirebaseService } from "./firebase.service";
import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/auth";
import { take, map } from "rxjs/operators";

import * as admin from "firebase-admin";
import * as firebase from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable, merge } from "rxjs";
import { DocumentReference } from "@google-cloud/firestore";

export interface User {
  id?: string;
  username: string;
  email: string;
  phoneNo: string;
  isSessionActive: boolean;
  image: string;
  role: string;
}

@Injectable({
  providedIn: "root"
})
export class UserService {
  private users: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;
  username: any;
  email: any;
  isActive: any;
  isBook: any;
  image: any;
  id: any;
  phoneNo: any;
  role: any;

  constructor(
    private afStore: AngularFirestore,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {
    this.userCollection = this.afStore.collection<User>("users");
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data;
          const id = a.payload.doc.id;
          const email = a.payload.doc.data().email;
          const username = a.payload.doc.data().username;
          const isSessionActive = a.payload.doc.data().isSessionActive;
          const image = a.payload.doc.data().image;
          const phoneNo = a.payload.doc.data().phoneNo;
          const role = a.payload.doc.data().role;
          return {
            id,
            email,
            username,
            isSessionActive,
            image,
            phoneNo,
            role,
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

  userBookingActive() {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;
    db.collection("users")
      .where("id", "==", userID)
      .get()
      .then(
        snap => {
          snap.forEach(doc => {
            const userState = doc.data().isBook;
            const docRef = db.collection("users").doc(doc.id);
            if (userState) {
              this.showAlert("Sorry!", "You have already created a booking");
            } else if (!userState) {
              docRef.set({ isBook: true }, { merge: true });
              this.showAlert(
                "Success!",
                "Updated book status to true in firestore"
              );
            }
          });
        },
        err => {
          this.showAlert(
            "Failure!",
            `Error in book session status to true in firestore due to: ${err}`
          );
        }
      );
  }

  userSessionActive() {
    const db = firebase.firestore();

    const user = this.authService.getUser();
    const userID = user.uid;
    db.collection("users")
      .where("id", "==", userID)
      .get()
      .then(
        snap => {
          snap.forEach(doc => {
            const userState = doc.data().isActive;
            const docRef = db.collection("users").doc(doc.id);
            if (userState) {
              return this.showAlert(
                "Sorry!",
                "You have already created a session"
              );
            } else if (!userState) {
              docRef.set({ isActive: true }, { merge: true });
              this.showAlert(
                "Success!",
                "Updated session status to true in firestore"
              );
            }
          });
        },
        err => {
          this.showAlert(
            "Failure!",
            `Error in updating session status to true in firestore due to: ${err}`
          );
        }
      );
  }

  getCurrentUser() {
    const db = firebase.firestore();

    const user = this.authService.getUser();
    const userId = user.uid;
    db.collection("users")
      .where("id", "==", userId)
      .get()
      .then(snap => {
        snap.forEach(a => {
          console.log("For each data", a.data().username);
          console.log("For each data", a.data());

          this.id = a.data().id;
          this.username = a.data().username;
          this.email = a.data().email;
          this.isActive = a.data().isActive;
          this.image = a.data().image;
          this.phoneNo = a.data().phoneNo;
          this.role = a.data().role;
        });
      });

    const data = {
      username: this.username,
      email: this.email,
      isActive: this.isActive,
      image: this.image,
      id: this.id,
      phoneNo: this.phoneNo,
      role: this.role
    };

    return data;
  }

  getUsers(): Observable<User[]> {
    return this.users;
  }

  getUser(id: string): Observable<User> {
    return this.userCollection
      .doc<User>(id)
      .valueChanges()
      .pipe(
        take(1),
        map(user => {
          user.id = id;
          return user;
        })
      );
  }

  addUser(user: User) {
    return this.userCollection.doc(user.id).set(user);
  }

  deleteUser(id: string): Promise<void> {
    return this.userCollection.doc(id).delete();
  }
}
