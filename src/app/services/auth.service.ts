import { environment } from "./../../environments/environment";
import {
  AlertController,
  Platform,
  ActionSheetController,
  LoadingController
} from "@ionic/angular";
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Injectable, OnDestroy } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, from, of } from "rxjs";
import { map, tap, first } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";

import { Storage } from "@ionic/storage";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";

import * as firebase from "firebase/app";
import { FirebaseService } from "./firebase.service";
import { Firebase } from "@ionic-native/firebase/ngx";

// export interface MyUser {
//   id: Observable<string>;
//   email: Observable<string>;
//   tokenId: Observable<string>;
// }

export const USER_DETAILS = "UserDetails";

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  authState = new BehaviorSubject(null);
  theResponse: Observable<any>;
  MyUser: Observable<any>;

  private userCollection: AngularFirestoreCollection;
  // private userToken;
  stateValue: boolean;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private google: GooglePlus,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private nativeStorage: NativeStorage,
    private fb: Facebook,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private afStore: AngularFirestore
  ) {
    this.userCollection = this.afStore.collection("users");
  }

  private user: firebase.User;
  private activeLogoutTimer: any;

  ngOnDestroy() {}

  isLoggedIn() {
    // Pipe first value emitted and convert to promise
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  checkEmailVerification() {
    const emailVerifyState = this.afAuth.auth.currentUser.emailVerified;
    return emailVerifyState;
  }

  getUserIsAuthenticated() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.stateValue = true;
      }
      this.stateValue = false;
    });

    return this.stateValue;
  }

  signInUserWithEmail(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          res => {
            const user = res.user;
            this.storeUserAuthDetails(user);
            resolve(res);
          },
          err => {
            this.showAlert("Error", `${err}}`);
            reject(err);
          }
        );
    });
  }

  storeUserAuthDetails(userData) {
    this.nativeStorage.setItem(USER_DETAILS, userData);
  }

  signUpUserWithEMail(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          res => {
            const user = res.user;
            this.storeUserAuthDetails(user);
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getUser() {
    return firebase.auth().currentUser;
  }

  async doGoogleLogin() {
    const loading = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    this.presentLoading(loading);
    this.google
      .login({
        // scopes: optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        webClientId: environment.webClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        offline: true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      .then(
        user => {
          //   const googleCredential = firebase.auth.GoogleAuthProvider.credential(
          //     user.idToken
          //   );
          //   firebase
          //     .auth()
          //     .signInWithCredential(googleCredential)
          //     .then(
          // success => {
          loading.dismiss();
          this.nativeStorage
            .setItem(USER_DETAILS, {
              name: user.displayName,
              email: user.email,
              picture: user.imageUrl
            })
            .then(
              () => {
                this.router.navigate(["/", "tab"]);
              },
              error => {
                console.log(error);
              }
            );
          //   },
          //   nonsuccess => this.showAlert("Error signing in", `${nonsuccess}`)
          // );
        },
        err => {
          console.log(err);
          loading.dismiss();
          this.showAlert("Error logging into google", `${err}`);
        }
      );
  }
  async presentLoading(loading) {
    return await loading.present();
  }

  // async loginGoogle() {
  //   let params;
  //   if (this.platform.is("android")) {
  //     params = {
  //       webClientId: environment.webClientId,
  //       offline: true
  //     };
  //   } else {
  //     params = {};
  //   }

  //   this.google
  //     .login(params)
  //     .then(res => {
  //       const { idToken, accessToken } = res;
  //       if (this.platform.is("android")) {
  //         this.onGoogleLoginSuccess(idToken, accessToken);
  //       } else {
  //         this.onGoogleWebLoginSuccess();
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       this.showAlert(
  //         "Error",
  //         `Error logging in due to ${JSON.stringify(err)}`
  //       );
  //     });
  // }

  // onGoogleLoginSuccess(accessToken, accessSecret) {
  //   const credential = accessSecret
  //     ? firebase.auth.GoogleAuthProvider.credential(accessToken, accessSecret)
  //     : firebase.auth.GoogleAuthProvider.credential(accessToken);
  //   this.afAuth.auth.signInWithCredential(credential).then(
  //     response => {
  //       this.showAlert("Success", `Successfully logged in by google`);
  //       this.router.navigateByUrl("/tab");
  //     },
  //     err => {
  //       this.showAlert(
  //         "Error",
  //         `Error logging in google account due to: ${err}`
  //       );
  //     }
  //   );
  // }

  // async onGoogleWebLoginSuccess() {
  //   try {
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     const credential = await this.afAuth.auth.signInWithPopup(provider);
  //     this.router.navigateByUrl("/tab");
  //   } catch (err) {
  //     this.showAlert(
  //       "Error",
  //       `Cannot succeed web google sign in due to: ${err}`
  //     );
  //   }
  // }

  private showAlert(header: string, message: string) {
    this.alertCtrl
      .create({ header, message, buttons: ["OK"] })
      .then(alertEl => alertEl.present());
  }

  logout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.nativeStorage.remove(USER_DETAILS);
            this.router.navigateByUrl("/login");
            console.log("Log out");
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }
}
