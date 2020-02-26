import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";
import { Coffee, CoffeeService } from "src/app/services/coffee.service";
import { ModalController, AlertController } from "@ionic/angular";
import { Observable } from "rxjs";
import { AnalysisCrashService } from "src/app/services/analysis-crash.service";

@Component({
  selector: "app-cart-modal",
  templateUrl: "./cart-modal.page.html",
  styleUrls: ["./cart-modal.page.scss"]
})
export class CartModalPage implements OnInit {
  cart: Coffee[] = [];

  totalPrice = 0;
  thePrice;

  userSessionStatus: boolean;

  constructor(
    private coffeeService: CoffeeService,
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private analysisService: AnalysisCrashService
  ) {
    this.analysisService.setPageName("Coffee Cart Modal");
    this.firebaseService.getCurrentSessionStatus().subscribe(val => {
      console.log("Value of Cart Modal", val);
      this.userSessionStatus = val;
    });
  }

  ngOnInit() {
    this.cart = this.coffeeService.getCart();
  }

  decreaseCartItem(product) {
    this.coffeeService.reduceCoffee(product);
  }

  increaseCartItem(product) {
    this.coffeeService.addCoffee(product);
  }

  removeCartItem(product) {
    this.coffeeService.removeCoffee(product);
  }

  getTotal() {
    return this.cart.reduce(
      (i, j) => (this.totalPrice = i + j.price * j.amount),
      0
    );
  }

  close() {
    // this.coffeeService.resetCart();
    this.modalCtrl.dismiss();
  }

  async checkout() {
    // Perfom PayPal or Stripe checkout process
    this.coffeeService.resetCart();
    if (!this.userSessionStatus) {
      this.alertCtrl
        .create({
          header: "Sorry",
          message: `You can't order coffee without an active session`,
          buttons: ["OK"]
        })
        .then(alertEl => {
          alertEl.present();
          this.modalCtrl.dismiss(0);
        });
    } else if (this.userSessionStatus) {
      this.alertCtrl
        .create({
          header: "Confirmed",
          message: `Your order will be brought to you shortly`,
          buttons: ["OK"]
        })
        .then(alertEl => {
          alertEl.present();
          this.firebaseService.updateCoffeeSession(this.totalPrice);
          this.firebaseService.updateBookingCoffeeValues(
            this.cart,
            this.totalPrice
          );
          this.modalCtrl.dismiss();
        });
    }
  }
}
