import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";
import { Coffee, CoffeeService } from "src/app/services/coffee.service";
import { ModalController, AlertController } from "@ionic/angular";

@Component({
  selector: "app-cart-modal",
  templateUrl: "./cart-modal.page.html",
  styleUrls: ["./cart-modal.page.scss"]
})
export class CartModalPage implements OnInit {
  cart: Coffee[] = [];

  totalPrice = 0;
  thePrice;

  constructor(
    private coffeeService: CoffeeService,
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

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
    this.modalCtrl.dismiss();
  }

  async checkout() {
    // Perfom PayPal or Stripe checkout process
    this.coffeeService.resetCart();

    // let alert = await this.alertCtrl.create({
    //   header: 'Thanks for your Order!',
    //   message: `The total price is ${this.totalPrice}`,
    //   buttons: ['OK']
    // });
    // alert.present().then(() => {
    this.firebaseService.updateCoffeeSession(this.totalPrice);
    this.modalCtrl.dismiss();
    // });
  }
}
