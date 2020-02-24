import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {
  version: string = "0.0.3";

  profilePic: String;
  username: String;
  user: { uid: string; phoneNumber: string; photoURL: string; creationTime: string; lastSignInTime: string; isAnonymous: boolean; email: string; displayName: string; emailVerified: boolean; refreshToken: string; };

  constructor(private authService: AuthService) {
    this.getProfilePic();
  }

  ngOnInit() { }

  getProfilePic() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user) {
          this.user = {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
            isAnonymous: user.isAnonymous,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            refreshToken: user.refreshToken
          };
        }
      }
    })

  }


  //   <!-- <ion-item routerLink="/session-history">
  //   <ion-icon slot="start" name="hourglass"></ion-icon>
  //   <ion-label>Your Sessions</ion-label>
  // </ion-item>
  // <ion-item routerLink="/settings">
  //   <ion-icon slot="start" name="build"></ion-icon>
  //   <ion-label>Settings</ion-label>
  // </ion-item>
  // <ion-item routerLink="/settings/share">
  //   <ion-icon slot="start" name="share"></ion-icon>
  //   <ion-label>Invite Your Friends</ion-label>
  // </ion-item>
  // <ion-item [routerLink]="['/settings/about']" routerLinkActive="router-link-active">
  //   <ion-label>About Us</ion-label>
  //   <ion-icon slot="start" name="information-circle"></ion-icon>
  // </ion-item>
  //   <ion-item routerLink="/tab">
  //   <ion-icon name="home" slot="start"></ion-icon>
  //   <ion-label>Home</ion-label>
  // </ion-item>
  //  <ion-item routerLink="/profile">
  //   <ion-icon name="contact" slot="start"></ion-icon>
  //   <ion-label>Profile</ion-label>
  // </ion-item>
  // <ion-item routerLink="/session-history">
  //   <ion-icon slot="start" name="hourglass"></ion-icon>
  //   <ion-label>Your Sessions</ion-label>
  // </ion-item>
  // <ion-item routerLink="/settings">
  //   <ion-icon slot="start" name="build"></ion-icon>
  //   <ion-label>Settings</ion-label>
  // </ion-item>
  // <ion-item routerLink="/settings/share">
  //   <ion-icon slot="start" name="share"></ion-icon>
  //   <ion-label>Invite Your Friends</ion-label>
  // </ion-item>
  // <ion-item [routerLink]="['/settings/about']" routerLinkActive="router-link-active">
  //   <ion-label>About Us</ion-label>
  //   <ion-icon slot="start" name="information-circle"></ion-icon>
  // </ion-item>

  appPages = [
    {
      title: 'Home',
      url: '/tab',
      icon: 'home'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'build'
    },
    {
      title: "Your Sessions",
      url: "/session-history",
      icon: "hourglass"
    },
    {
      title: "Invite your Friends",
      url: "/settings/share",
      icon: "share"
    },
    {
      title: "About Us",
      url: "/settings/about",
      icon: "information-circle"
    }
  ];



  async leaveAReview() { }


  openFacebookProfile() { }


  openInstagramProfile() { }


  openTwitterProfile() { }


  openWebsite() { }


}
