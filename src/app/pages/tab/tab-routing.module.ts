import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TabPage } from "./tab.page";
import { AuthGuard } from "src/app/services/auth.guard";

const routes: Routes = [
  {
    path: "tabs",
    component: TabPage,
    children: [
      {
        path: "map",
        loadChildren: () =>
          import("./../map/map.module").then(m => m.MapPageModule)
        // canLoad: [AuthGuard],
      },
      {
        path: "coffee",
        loadChildren: () =>
          import("../coffee/coffee.module").then(m => m.CoffeePageModule)
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tab/tabs/map",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabPageRoutingModule {}
