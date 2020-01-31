import { AuthService } from "./auth.service";
import { Platform } from "@ionic/angular";
import { Firebase } from "@ionic-native/firebase/ngx";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  constructor(
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private firebase: Firebase,
    private platform: Platform,
    private authService: AuthService
  ) {}

  async getToken() {
    let token;
    if (this.platform.is("android")) {
      token = await this.firebase.getToken();
    }

    this.saveToken(token);
  }

  saveToken(token: string) {
    if (!token) return;

    const devicesCollection = this.afStore.collection("userDevices");

    const userData = this.authService.getUser();
    const data = {
      token,
      userId: userData.uid
    };
    return devicesCollection.doc(token).set(data);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
