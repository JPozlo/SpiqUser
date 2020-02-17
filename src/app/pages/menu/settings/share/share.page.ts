import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  constructor(private socialSharing: SocialSharing, private analysisService: AnalysisCrashService) {
    this.analysisService.setPageName('Share Page');
  }

  ngOnInit() {
  }

  sendShare() {
    const message = "Check out this awesome app, SPIQ, that I have been using!"
    const subject = "SPIQ App Sharing"
    const URL = "https://mapsdemoone.web.app/"
    this.socialSharing.share(message, subject, URL);

  }

}
