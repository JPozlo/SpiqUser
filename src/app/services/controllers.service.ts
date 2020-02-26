import { AlertController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControllersService {

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) { }

  showAlert(header: string, message: string) {
    this.alertCtrl.create({ header, message, buttons: ["OK"] })
      .then(alertEl => alertEl.present())
      .catch(err => console.dir(err))
  }

  showToast(header: string, message: string, duration: number, position) {
    this.toastCtrl.create({ header, message, duration, position }).then(toastEl =>
      toastEl.present()
    ).catch(err => console.dir(err))
  }
}
