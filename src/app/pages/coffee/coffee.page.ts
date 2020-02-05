import { NgForm } from "@angular/forms";
import { FirebaseService } from "src/app/services/firebase.service";
import { CallNumber } from "@ionic-native/call-number/ngx";
import {
  Contacts,
  Contact,
  ContactName,
  ContactField
} from "@ionic-native/contacts/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { BehaviorSubject, Observable, of } from "rxjs";
import { CoffeeService } from "./../../services/coffee.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { CartModalPage } from "./cart-modal/cart-modal.page";

@Component({
  selector: "app-coffee",
  templateUrl: "./coffee.page.html",
  styleUrls: ["./coffee.page.scss"]
})
export class CoffeePage implements OnInit {
  @ViewChild("cart", { static: false, read: ElementRef }) fab: ElementRef;

  cart = [];
  coffees = [];
  cartItemCount: BehaviorSubject<number>;

  price: Observable<number>;

  totalPrice = 0;

  constructor(
    private coffeeService: CoffeeService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private sms: SMS,
    private contacts: Contacts,
    private callNumber: CallNumber,
    private firebaseService: FirebaseService
  ) {
    this.showToast(
      "Important!",
      "This service is only available if you have an active session"
    );
    // this.totalPrice = this.firebaseService.getCoffeeTotalPrice();
    this.totalPrice = this.firebaseService.getCoffeeTotalPrice();
  }

  showToast(header: string, message: string) {
    this.toastCtrl
      .create({
        header,
        message,
        duration: 4000,
        position: "top"
      })
      .then(toastEl => toastEl.present());
  }

  ngOnInit() {
    this.cart = this.coffeeService.getCart();
    this.coffees = this.coffeeService.getCoffees();
    this.cartItemCount = this.coffeeService.getCartItemCount();
    console.log(this.totalPrice);
  }

  addToCart(coffee) {
    this.coffeeService.addCoffee(coffee);
    this.animateCSS("tada");
  }

  async openCart() {
    this.animateCSS("bounceOutLeft", true);

    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: "cart-modal"
    });
    modal.onDidDismiss().then(data => {
      this.fab.nativeElement.classList.remove("animated", "bounceOutLeft");
      this.animateCSS("bounceInLeft");
      // this.totalPrice += data.data;
    });
    modal.present();
  }

  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add("animated", animationName);
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove("animated", animationName);
      }
      node.removeEventListener("animationend", handleAnimationEnd);
    }
    node.addEventListener("animationend", handleAnimationEnd);
  }
}
