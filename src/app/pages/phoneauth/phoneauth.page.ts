import { AngularFireAuth } from "@angular/fire/auth";
import { FirebaseAuthentication } from "@ionic-native/firebase-authentication/ngx";
import { Router } from "@angular/router";
import { ModalController, AlertController } from "@ionic/angular";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

// import * as firebase from 'firebase/app';

@Component({
  selector: "app-phoneauth",
  templateUrl: "./phoneauth.page.html",
  styleUrls: ["./phoneauth.page.scss"]
})
export class PhoneauthPage implements OnInit {
  @ViewChild("recap", { static: false, read: ElementRef }) recapEl: ElementRef;

  verificationID;
  code;
  phoneNo;
  phoneNoSent = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private nativeStorage: NativeStorage,
    private afAuth: AngularFireAuth,
    private firebaseAuth: FirebaseAuthentication,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    firebaseAuth.onAuthStateChanged().subscribe(user => {
      if (user) {
        this.router.navigateByUrl("/tab/home");
      } else {
        this.router.navigateByUrl("/phoneauth");
      }
    });
  }

  ngOnInit() {
    this.code = "";
    this.phoneNo = "";
  }

  sendOTP() {
    this.firebaseAuth.verifyPhoneNumber(this.phoneNo, 30000).then(
      res => {
        console.log("The verification ID is this: ", res);
        this.showAlert("OTP Success", "OTP sent");
        this.verificationID = res;
        this.phoneNoSent = true;
      },
      err => this.showAlert("Error", `Error sending otp: ${err}`)
    );
  }

  verify() {
    this.firebaseAuth
      .signInWithVerificationId(this.verificationID, this.code)
      .then(
        user => {
          console.log("The user is ", user);
          this.showAlert("Success", "Sign in with phone OK");
          this.router.navigateByUrl("/tab");
        },
        err =>
          this.showAlert(
            "Error",
            `Error signing in with phone because of: ${err}`
          )
      );
  }

  showAlert(header: string, message: string) {
    this.alertCtrl
      .create({
        header,
        message,
        buttons: ["OK"]
      })
      .then(alertEl => alertEl.present());
  }
}
