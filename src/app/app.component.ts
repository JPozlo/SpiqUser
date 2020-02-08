import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { Network } from "@ionic-native/network/ngx";
import { NetworkService } from "./services/network.service";
import { USER_DETAILS } from "./services/auth.service";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { AngularFireAuth } from "@angular/fire/auth";
import { FcmService } from "./services/fcm.service";
import { Subscription, timer } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";

import {
  Platform,
  ToastController,
  MenuController,
  ActionSheetController,
  AlertController
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  showSplash = true;
  private firebaseX: FirebaseX;

  private previousAuthState = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private nativeStorage: NativeStorage,
    private afAuth: AngularFireAuth,
    private statusBar: StatusBar,
    private authService: AuthService,
    private ngZone: NgZone,
    private router: Router,
    private fcmService: FcmService,
    private toastCtrl: ToastController,
    private menuCtrl: MenuController,
    private networkService: NetworkService,
    private actionSheetCtrl: ActionSheetController,
    private network: Network,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
    // this.nativeStorage.getItem(USER_DETAILS).then(user => {
    //   if (user) {
    //     this.router.navigateByUrl("/tab");
    //   } else {
    //     this.router.navigateByUrl("/login");
    //   }
    // });

    this.networkService.connected().subscribe(
      res => {
        this.showToast("Connected", `${this.network.type}`);
      },
      err => this.showToast("Error", `${err}`)
    );

    this.networkService.disconnected().subscribe(
      res => {
        this.showToast("No Internet!", "Connect to wifi or mobile network.");
      },
      err => this.showToast("Error", `${err}`)
    );

    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.navigate(["/", "tab", "tabs", "map"]);
        this.watchToken();
      } else {
        this.navigate(["/", "login"]);
      }
    });
  }

  ngOnInit() {
    this.menuCtrl.enable(true, "menu");
  }

  showToast(header, message) {
    this.toastCtrl
      .create({ header, message, duration: 4000, position: "bottom" })
      .then(toastEl => {
        toastEl.present();
      });
  }

  automaticDetection() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    toggleDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener(mediaQuery => toggleDarkTheme(mediaQuery.matches));

    // Add or remove the "dark" class based on if the media query matches
    function toggleDarkTheme(shouldAdd) {
      document.body.classList.toggle("dark", shouldAdd);
    }
  }

  private navigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

  watchToken() {
    this.firebaseX.onTokenRefresh().subscribe(
      token => {
        this.fcmService.saveToken(token).then(
          success => {
            this.showAlert("Success", "Token refresh stored successfully");
          },
          err => this.showAlert("Error", `Cannot save token due to: ${err}`)
        );
      },
      err => this.showAlert("Error", `Cannot find refresh token cuz of: ${err}`)
    );
  }

  onLogout() {
    this.actionSheetCtrl
      .create({
        header: "Are you sure?",
        buttons: [
          {
            text: "Logout",
            handler: () => {
              this.authService.logout();
            }
          },
          {
            text: "Cancel",
            role: "cancel"
          }
        ]
      })
      .then(el => {
        el.present();
      });
  }

  ngOnDestroy() {}

  showAlert(title, message) {
    this.alertCtrl
      .create({
        header: title,
        message,
        buttons: ["OK"]
      })
      .then(alertEl => alertEl.present());
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      timer(3500).subscribe(() => (this.showSplash = false));
      this.automaticDetection();
    });
  }
}
