import { LoginGuard } from "./services/login.guard";
import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./services/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/auth/login/login.module").then(m => m.LoginPageModule)
    // canActivate: [LoginGuard]
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/auth/register/register.module").then(
        m => m.RegisterPageModule
      )
    // canActivate: [LoginGuard]
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pages/menu/settings/settings.module").then(
        m => m.SettingsPageModule
      )
    // canLoad: [AuthGuard]
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./pages/menu/profile/profile.module").then(
        m => m.ProfilePageModule
      )
    // canLoad: [AuthGuard]
  },
  {
    path: "verify-email",

    loadChildren: () =>
      import("./pages/auth/verify-email/verify-email.module").then(
        m => m.VerifyEmailPageModule
      )
  },
  {
    path: "forgot-password",
    loadChildren: () =>
      import("./pages/auth/forgot-password/forgot-password.module").then(
        m => m.ForgotPasswordPageModule
      )
  },
  {
    path: "tab",
    loadChildren: () =>
      import("./pages/tab/tab.module").then(m => m.TabPageModule)
    // canLoad: [AuthGuard]
  },
  {
    path: "phoneauth",
    loadChildren: () =>
      import("./pages/phoneauth/phoneauth.module").then(
        m => m.PhoneauthPageModule
      )
  },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "phoneconfirm",
    loadChildren: () =>
      import("./pages/phoneconfirm/phoneconfirm.module").then(
        m => m.PhoneconfirmPageModule
      )
  },
  {
    path: "test",
    loadChildren: () =>
      import("./pages/test/test.module").then(m => m.TestPageModule)
  },
  {
    path: 'placeslistmodal',
    loadChildren: () => import('./pages/placeslistmodal/placeslistmodal.module').then( m => m.PlaceslistmodalPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
