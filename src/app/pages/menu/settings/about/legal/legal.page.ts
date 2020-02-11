import { Component, OnInit } from '@angular/core';
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
})
export class LegalPage implements OnInit {

  constructor(private analysisService: AnalysisCrashService) {
    this.analysisService.setPageName('Legal Page');
  }

  ngOnInit() {
  }

}
