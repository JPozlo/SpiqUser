import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Injectable({
  providedIn: 'root'
})
export class AnalysisCrashService {

  constructor(private firebaseAnalytics: FirebaseAnalytics) { }

  setPageName(name: string) {
    this.firebaseAnalytics.setCurrentScreen(name);
  }

}
