import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from "@angular/core";
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-display",
  templateUrl: "./display.page.html",
  styleUrls: ["./display.page.scss"]
})
export class DisplayPage implements OnInit {

  myToggleValue: boolean;
  constructor(private analysisService: AnalysisCrashService) {
    this.analysisService.setPageName('Display Page');
  }

  ngOnInit() {
  }

  changeColour() {
    // Query for the toggle that is used to change between themes
    const toggle = document.querySelector("#themeToggle");

    // Listen for the toggle check/uncheck to toggle the dark class on the <body>
    toggle.addEventListener("ionChange", ev => {
      document.body.classList.toggle(
        "dark",
        (ev as CustomEvent).detail.checked
      );
    });

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener(e => checkToggle(e.matches));

    // Called when the app loads
    function loadApp() {
      checkToggle(prefersDark.matches);
    }

    // Called by the media query to check/uncheck the toggle
    function checkToggle(shouldCheck) {
      (toggle as any).checked = shouldCheck;
    }
    this.myToggleValue = !this.myToggleValue;
  }
}
