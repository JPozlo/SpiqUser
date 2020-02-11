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

  sendShare(message, subject, url) {
    this.socialSharing.share(message, subject, url);

  }

}
