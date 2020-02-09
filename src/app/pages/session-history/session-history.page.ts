import { Observable } from "rxjs";
import { FirebaseService, Session } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-session-history",
  templateUrl: "./session-history.page.html",
  styleUrls: ["./session-history.page.scss"]
})
export class SessionHistoryPage implements OnInit {
  history;

  constructor(private firebaseService: FirebaseService) {
    this.history = firebaseService.getUserSessions();
    console.log(this.history);
  }

  ngOnInit() { }
}
