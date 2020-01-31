import { NgForm } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-help",
  templateUrl: "./help.page.html",
  styleUrls: ["./help.page.scss"]
})
export class HelpPage implements OnInit {
  helpMessage: string;

  constructor() {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.helpMessage = form.value.helpMsg;

    // send mmsg to our support email
  }
}
