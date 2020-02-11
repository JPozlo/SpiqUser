import { NgForm } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: "app-help",
  templateUrl: "./help.page.html",
  styleUrls: ["./help.page.scss"]
})
export class HelpPage implements OnInit {
  helpMessage: string;

  constructor(private analysisService: AnalysisCrashService) {
    this.analysisService.setPageName('Help Page');
  }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    this.helpMessage = form.value.helpMsg;

    // send mmsg to our support email
  }
}
