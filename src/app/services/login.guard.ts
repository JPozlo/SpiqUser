import { first } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // async wraps function in a promise
  // (angular will wait for promises and observables to complete; if they never complete the page will hang!)
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.authService.isLoggedIn) {
      this.router.navigateByUrl("/login");
      return true;
    }
    this.router.navigateByUrl("/tab");
    return false;

    // const userIsAuth = this.authService.getUserIsAuthenticated();
    // if (userIsAuth) {
    //   return false;
    // } else {
    //   return true;
    // }

    // Call isLoggedIn method and await result.
    // If false allow navigation to login page, else navigate to home
    // const user = this.authService
    //   .isLoggedIn()
    //   .pipe(first())
    //   .toPromise();
    // if (!user) {
    //   this.router.navigateByUrl("/login");
    //   return true;
    // } else {
    //   return false;
    // }
    // if (!this.authService.isLoggedIn()) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
}
