import { PhoneauthPageModule } from "./../../phoneauth/phoneauth.module";
import { AngularFireAuth } from "@angular/fire/auth";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  LoadingController,
  AlertController,
  Platform,
  ModalController,
  NavController
} from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import * as firebase from "firebase/app";

import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { UserService } from 'src/app/services/user.service';
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  @ViewChild("reCAPTCHA", { static: false }) recaptchaElement: ElementRef;
  isLoading = false; // For ion spinner
  private username = "";
  private email = "";
  private password = "";
  private phone;
  private recaptchaVerifier;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private google: GooglePlus,
    private userService: UserService,
    private analysisService: AnalysisCrashService,
    private navCtrl: NavController
  ) {
    this.analysisService.setPageName('login');
  }

  ngOnInit() { }

  resetPass() {
    this.router.navigateByUrl("/forgot-password");
  }

  onSwitchMode() {
    this.router.navigateByUrl("/register");
  }

  logging(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Logging in..." })
      .then(loadingEl => {
        let authObs = this.authService.signInUserWithEmail(email, password);
        loadingEl.present();
        authObs.then(
          resData => {
            console.log("Response of logging in: ", resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.authService.storeUserAuthDetails(resData);
            this.navCtrl.navigateForward('/tab')
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = "Could not sign up. Try again.";
            if (code === "EMAIL_EXISTS") {
              message = "This email address already exists!";
            } else if (code === "EMAIL_NOT_FOUND") {
              message = "Email address not found.";
            } else if (code === "INVALID_PASSWORD") {
              message = "This passowrd is not correct.";
            }
            this.showAlert('Authentication Failed', message);
          }
        );
      });
  }

  loginGoogle() {
    this.authService.myGoogleSignin().then(
      success => {
        const user = success.user;
        const NewUser = {
          id: user.uid,
          username: user.displayName,
          email: user.email,
          phoneNo: user.phoneNumber,
          isSessionActive: false,
          image: user.photoURL,
          role: "user",
        };
        this.userService.addUser(NewUser);
        this.authService.storeUserAuthDetails(user);
        this.router.navigateByUrl("/tab");
      },
      err => this.showAlert('Authentication Failed', `Error: ${err}`)
    );
  }

  loginTwitter() { }

  loginPhone() {
    this.router.navigateByUrl("/phoneauth");
  }

  private showAlert(header: string, message: string) {
    this.alertCtrl
      .create({ header, message, buttons: ["OK"] })
      .then(alertEl => alertEl.present());
  }

  // Template driven form
  onSubmit(form: NgForm) {
    console.dir(form.status);
    if (!form.valid) {
      return;
    }
    this.username = form.value.username;
    this.email = form.value.email;
    this.password = form.value.password;

    console.dir(this.email, this.password);

    this.logging(this.email, this.password);
    form.reset();
  }
}
