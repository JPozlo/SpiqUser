import { AngularFireAuth } from "@angular/fire/auth";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { Observable } from "rxjs";
import { NgForm } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  private isLoading = false;
  private userCollection: AngularFirestoreCollection;
  private email = "";
  private username = "";
  private password = "";
  private cpassword = "";
  private user;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userService: UserService,
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private analysisService: AnalysisCrashService
  ) {
    this.analysisService.setPageName('register');
  }

  ngOnInit() {
    this.userCollection = this.afStore.collection("users");
  }

  onSwitchMode() {
    this.router.navigateByUrl("/login");
  }

  register(username: string, email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Creating account..." })
      .then(loadingEl => {
        loadingEl.present();
        let authObs = this.authService.signUpUserWithEMail(email, password);
        authObs.then(
          res => {
            const id = res.user.uid;
            const user = res.user;

            user.updateProfile({
              displayName: username
            });

            const NewUser = {
              id,
              username,
              email: user.email,
              phoneNo: user.phoneNumber,
              isSessionActive: false,
              image: user.photoURL,
              role: "user",
            };

            console.log("Response of signing in is ", res);
            console.log("UID of the user is", id);


            this.userService.addUser(NewUser);
            this.authService.storeUserAuthDetails(user);

            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl("/tab");
          },
          err => {
            loadingEl.dismiss();
            let message = `Could not sign up because of ${err}. Try again.`;
            this.showAlert(message);
          }
        );
      });
  }

  loginGoogle() {
    this.authService.myGoogleSignin().then(
      success => {
        this.showAlert(`${success.user}`);
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
      err => this.showAlert(`Error: ${err}`)
    );;
  }

  loginTwitter() { }

  loginPhone() {
    this.router.navigateByUrl("/phoneauth");
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({ header: "Authentication failed!", message, buttons: ["OK"] })
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
    this.cpassword = form.value.cpassword;

    if (this.password !== this.cpassword) {
      this.showAlert("Passwords don't match");
    }

    console.dir(this.username, this.email, this.password, this.cpassword);

    this.register(this.username, this.email, this.password);
    form.reset();
  }
}
