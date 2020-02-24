import { AuthService } from "./auth.service";
import { Platform } from "@ionic/angular";
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
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
    private firebase: FirebaseX,
    private platform: Platform,
    private authService: AuthService
  ) { }

  async getToken() {
    let token;
    if (this.platform.is("android" || "cordova")) {
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
    return devicesCollection.doc(userData.uid).set(data);
  }

  onNotifications() {
    return this.firebase.onMessageReceived();
  }

  onError(errorBody) {
    return this.firebase.logError(errorBody);
  }
}
