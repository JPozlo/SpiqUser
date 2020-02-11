import { Component, OnInit } from '@angular/core';
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private analysisService: AnalysisCrashService
  ) {
    this.analysisService.setPageName('Settings Page');
  }

  ngOnInit() {
  }

}
