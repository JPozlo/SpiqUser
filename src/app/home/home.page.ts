import { ControllersService } from './../../../emailLinkWebApp/services/controllers.service';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { FirebaseService } from './../services/firebase.service';
import { BookingService } from './../services/booking.service';
import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  locationCoords: any;
  timetest: any;

  hours: number;

  emailIsVerified: boolean;

  constructor(
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private bookingService: BookingService,
    private firebaseService: FirebaseService,
    private platform: Platform,
    private fireDynamicLinks: FirebaseDynamicLinks,
    private userService: UserService,
    private controllerService: ControllersService
  ) {
    this.locationCoords = {
      latitude: '',
      longitude: '',
      accuracy: '',
      timestamp: ''
    };
    this.timetest = Date.now();

    this.afAuth.authState.subscribe(user => {
      if (user) {
        setInterval(() => {
          this.emailIsVerified = this.authService.checkEmailVerification();
        }, 1000);
      }
    })
  }

  ngOnInit() {
  }

  verifyEmail() {
    const actionCodeSettings = {
      // URL you want to redirect back to. Enter the Firebase hosting url here.
      url: 'https://mapsdemoone.firebaseapp.com',
      handleCodeInApp: true,
      android: {
        packageName: 'com.example.mapsdemo'
      }
    };
    this.afAuth.auth.currentUser.sendEmailVerification(actionCodeSettings);
    this.fireDynamicLinks.onDynamicLink().subscribe((res: any) => {
      console.log(res);

      this.emailIsVerified = true;
      // this.afAuth.auth.signInWithEmailLink(this.email, res["deepLink"]).then(res => {
      //   console.log('Logged in successfully!');
      //   // this.router.navigateByUrl('/tab');
      // })
      // .catch(err => {
      //   console.error(`Error logging in: ${err}`);
      // });
      this.controllerService.showAlert('Success', `Link intercepted and response is ${res}`);
    }, (err: any) => {
      this.controllerService.showAlert('Error', `Error intercepting link due to: ${err}`);
      console.log(`Error intercepting link: ${err}`);
    });
  }


  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      .then(result => {
        if (result.hasPermission) {
          // If having permission, show 'Turn On GPS' dialog
          this.askToTurnOnGPS();
        } else {
          // If not having permission, ask for permission
          this.requestGPSPermission();
        }
      }, err => {
        alert(err);
      });
  }
  requestGPSPermission() {
    this.locationAccuracy.canRequest()
      .then((canRequest: boolean) => {
        if (canRequest) {
          console.log("4");
        } else {
          // Show "GPS permission request" dialog
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(() => {
              // call method to turn on gps
              this.askToTurnOnGPS();
            }, err => {
              // Show alert if user clicks on "No thanks"
              alert('requestPermission Error requesting location permissions' + err);
            });
        }
      });
  }
  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(() => {
        // When GPS turned ON, call method to get Accurate location coordinates
        this.getLocationCoordinates();
      }, err => alert('Error requesting location permissions' + JSON.stringify(err)));
  }

  // Method to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        this.locationCoords.latitude = resp.coords.latitude;
        this.locationCoords.longitude = resp.coords.longitude;
        this.locationCoords.accuracy = resp.coords.accuracy;
        this.locationCoords.timestamp = resp.timestamp;
      }).catch((err) => {
        alert('Error getting location ' + err);
      });
  }

  moveToMaps() {
    this.router.navigate(['/', 'map']);
  }

  getHrValue(hrs: number) {
    this.hours = hrs;
  }

  startSession() {
    // return this.bookingService.timeSession(this.hours);
  }
  startBook() {
    this.bookingService.bookPlace('lsskkssk');
  }


}
