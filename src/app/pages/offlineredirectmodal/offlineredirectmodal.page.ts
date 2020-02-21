import { Network } from "@ionic-native/network/ngx";
import { Component, OnInit } from "@angular/core";
import { ToastController, ModalController } from "@ionic/angular";

@Component({
  selector: "app-offlineredirectmodal",
  templateUrl: "./offlineredirectmodal.page.html",
  styleUrls: ["./offlineredirectmodal.page.scss"]
})
export class OfflineredirectmodalPage implements OnInit {
  URL = "assets/offlinepic.PNG";

  constructor(
    private toastCtrl: ToastController,
    private network: Network,
    private modalCtrl: ModalController
  ) {
    this.network.onConnect().subscribe(
      res => {
        this.closeModal();
      },
      err => console.log("The error", err)
    );
  }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  showToast(header, message) {
    this.toastCtrl
      .create({ header, message, duration: 4000, position: "bottom" })
      .then(toastEl => {
        toastEl.present();
      });
  }
}
