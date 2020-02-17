import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email;
  error;

  constructor(
    private analysisService: AnalysisCrashService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastCtrl: ToastController) {
    this.analysisService.setPageName('Reset Password');
  }

  ngOnInit() {
  }

  recoverPass(email) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(data => {
        console.log(data);
        this.showToast('Reset email has been successfully sent to your email');
        this.router.navigateByUrl('/login');
      }, err => {
        console.log(`Password reset failed due to ${err}`);
        this.error = err.message;
        this.showToast(`Reset email couldn't be send due to: ${this.error}`);
      });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  async showToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3500,
      position: 'top'
    });
    await toast.present();
  }

  onSubmit(form: NgForm) {
    console.dir(form.status);
    if (!form.valid) {
      return;
    }
    this.email = form.value.email;

    this.recoverPass(this.email);

    form.reset();


  }

}
