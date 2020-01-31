import { AngularFireAuth } from "@angular/fire/auth";
import { take, tap, switchMap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  Router,
  UrlSegment,
  Route
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      return false;
    }

    // this.afAuth.auth.onAuthStateChanged(user => {
    //   if (user) {
    //     return true;
    //   }
    //   return false;
    // })
  }
}
