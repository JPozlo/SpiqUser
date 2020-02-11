import { Component, OnInit } from '@angular/core';
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    private analysisService: AnalysisCrashService
  ) {
    this.analysisService.setPageName('About Page');
  }

  ngOnInit() {
  }

}
