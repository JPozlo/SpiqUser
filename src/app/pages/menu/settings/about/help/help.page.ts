import { NgForm } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { AnalysisCrashService } from "src/app/services/analysis-crash.service";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

@Component({
  selector: "app-help",
  templateUrl: "./help.page.html",
  styleUrls: ["./help.page.scss"]
})
export class HelpPage implements OnInit {
  helpMessage: string;

  constructor(
    private analysisService: AnalysisCrashService,
    private androidPermissions: AndroidPermissions
  ) {
    this.analysisService.setPageName("Help Page");
  }

  ngOnInit() {}

  // sendEmail(emailBody: string) {
  //   let email = {
  //     to: 'spiqreaders@gmail.com',
  //     cc: 'ozlocollins@gmail.com',
  //     subject: 'SPIQ Help Message',
  //     body: emailBody,
  //     isHtml: true
  //   }
  //   this.emailComposer.hasPermission().then((hasPermission) => {
  //     if (hasPermission) {
  //       this.emailComposer.isAvailable().then((available: boolean) => {
  //         if (available) {
  //           this.emailComposer.open(email);
  //         }
  //       })
  //     } else {
  //       this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.GET_ACCOUNTS_PRIVILEGED).then((granted) => {
  //         this.emailComposer.isAvailable().then((available: boolean) => {
  //           if (available) {
  //             this.emailComposer.open(email);
  //           }
  //         })
  //       }, err => {
  //         console.log('Permission rejected! ', err);
  //       })
  //     }
  //   })

  // }

  // onSubmit(form: NgForm) {
  //   this.helpMessage = form.value.helpMsg;

  //   // send mmsg to our support email

  //   this.sendEmail(this.helpMessage);
  // }
}
