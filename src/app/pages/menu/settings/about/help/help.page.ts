import { ControllersService } from './../../../../../../../emailLinkWebApp/services/controllers.service';
import { NgForm } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { AnalysisCrashService } from "src/app/services/analysis-crash.service";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: "app-help",
  templateUrl: "./help.page.html",
  styleUrls: ["./help.page.scss"]
})
export class HelpPage implements OnInit {
  helpMessage: string;

  constructor(
    private analysisService: AnalysisCrashService,
    private androidPermissions: AndroidPermissions,
    private composer: EmailComposer,
    private controllers: ControllersService
  ) {
    this.analysisService.setPageName("Help Page");
  }

  ngOnInit() { }

  sendEmail() {
    this.sendEmailFunction();
    // this.composer.hasPermission().then(has => {
    //   if (has) {
    //     this.sendEmailFunction();
    //   } else {
    //     this.composer.requestPermission().then(granted => {
    //       if (granted) {
    //         this.sendEmailFunction();
    //       } else {
    //         this.controllers.showAlert("Sorry for the inconvenience", "We need your permission to enable you to send us your problems via email easily.")
    //       }
    //     })
    //   }
    // })
  }

  sendEmailFunction() {
    this.composer.open({
      to: 'spiqreaders@gmail.com'
    }).then(res => console.log(res))
      .catch(err => this.controllers.showAlert("Sorry", "There is a problem opening the email"));
  }
}
