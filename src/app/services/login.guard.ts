import { first } from "rxjs/operators";
import { AuthService, USER_DETAILS } from "src/app/services/auth.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  CanLoad,
  Router,
  Route,
  UrlSegment
} from "@angular/router";
import { Observable } from "rxjs";
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: "root"
})
export class LoginGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth, private navCtrl: NavController) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve, reject) => {
      this.afAuth.user.subscribe((user) => {
        if (user) {
          this.navCtrl.navigateRoot('/tab')
          resolve(false);
        } else {
          resolve(true);
        }
      }, err => reject(err))
    })


  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.afAuth.user.subscribe((user) => {
        if (user) {
          resolve(true);
        } else {
          this.navCtrl.navigateRoot('/login')
          resolve(false)
        }
      })
    })
  }

}
