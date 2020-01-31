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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // const userIsAuth = this.authService.getUserIsAuthenticated();
    // if (userIsAuth) {
    //   return false;
    // } else {
    //   return true;
    // }

    // Call isLoggedIn method and await result.
    // If false allow navigation to login page, else navigate to home
    if (!this.authService.isLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }
}
