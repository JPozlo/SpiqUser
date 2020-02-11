import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Injectable({
  providedIn: 'root'
})
export class AnalysisCrashService {

  constructor(private firebaseX: FirebaseX) { }

  setPageName(name: string) {
    this.firebaseX.setScreenName(name);
  }

}
