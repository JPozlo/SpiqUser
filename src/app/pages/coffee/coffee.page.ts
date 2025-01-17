import { NgForm } from "@angular/forms";
import { OverlayEventDetail } from "@ionic/core";
import { FirebaseService } from "src/app/services/firebase.service";
import {
  Contacts,
  Contact,
  ContactName,
  ContactField
} from "@ionic-native/contacts/ngx";
import { BehaviorSubject, Observable, of } from "rxjs";
import { CoffeeService } from "./../../services/coffee.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { CartModalPage } from "./cart-modal/cart-modal.page";
import { AnalysisCrashService } from "src/app/services/analysis-crash.service";

@Component({
  selector: "app-coffee",
  templateUrl: "./coffee.page.html",
  styleUrls: ["./coffee.page.scss"]
})
export class CoffeePage implements OnInit, OnDestroy {
  @ViewChild("cart", { static: false, read: ElementRef }) fab: ElementRef;

  cart = [];
  coffees = [];
  cartItemCount: BehaviorSubject<number>;

  totalPrice = 0;
  startTime: number;
  stopTime: number;
  priceObserver: Observable<any>;

  constructor(
    private coffeeService: CoffeeService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private contacts: Contacts,
    private firebaseService: FirebaseService,
    private analysisService: AnalysisCrashService
  ) {
    this.analysisService.setPageName("Coffee");
    this.firebaseService.getCoffeeTotalPrice().subscribe((val: number) => {
      console.log("Value:", val);
      this.totalPrice = val;
    });
  }

  onDidDismiss() {
    this.totalPrice = 0;
  }

  ngOnDestroy() {
    this.totalPrice = 0;
  }

  getTimeDifference() {
    let diff = 0;
    if (this.startTime && this.stopTime != null) {
      diff = this.stopTime - this.startTime;
    }
    return diff;
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
    modal.onDidDismiss().then((data: OverlayEventDetail<number>) => {
      this.fab.nativeElement.classList.remove("animated", "bounceOutLeft");
      this.animateCSS("bounceInLeft");
      if (data.data === 0) {
        this.totalPrice = data.data;
      }
      // this.coffeeService.resetCart();
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
