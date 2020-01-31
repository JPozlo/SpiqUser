import { AlertController, ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControllersService {

  constructor(
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  showAlert(header: string, message: string) {
    this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    }).then(alertEl => {
      alertEl.present();
    });
  }

  showToast(header, message) {
    this.toastCtrl.create({
      header,
      message,
      duration: 3000
    }).then(toastEl => toastEl.present());
  }


}
