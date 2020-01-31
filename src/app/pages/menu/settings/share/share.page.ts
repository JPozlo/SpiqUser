import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  constructor(private socialSharing: SocialSharing) { }

  ngOnInit() {
  }

  sendShare(message, subject, url) {
    this.socialSharing.share(message, subject, url);

  }

}
