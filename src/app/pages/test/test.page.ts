import { Component, OnInit } from "@angular/core";

declare var smsReceive: any;
@Component({
  selector: "app-test",
  templateUrl: "./test.page.html",
  styleUrls: ["./test.page.scss"]
})
export class TestPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  start() {
    smsReceive.startWatch(
      () => {
        console.log("watch started");
        document.addEventListener("onSMSArrive", (e: any) => {
          console.log("onSMSArrive()");
          var IncomingSMS = e.data;
          console.log(JSON.stringify(IncomingSMS));
        });
      },
      () => {
        console.log("watch start failed");
      }
    );
  }

  stop() {
    setTimeout(() => {
      smsReceive.stopWatch(
        () => console.log("Event stopped!"),
        () => console.log("Event stop failed!")
      );
    }, 30000);
  }
}
