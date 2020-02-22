import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface Coffee {
  id: number;
  name: string;
  price: number;
  amount: number;
}


@Injectable({
  providedIn: 'root'
})
export class CoffeeService {

  totalPrice;

  data: Coffee[] = [
    { id: 0, name: 'Cappuchino Large', price: 100, amount: 0 },
    { id: 1, name: 'Expresso Large', price: 100, amount: 0 },
    { id: 2, name: 'Cappuchino Medium', price: 100, amount: 0 },
    { id: 3, name: 'Expresso Medium', price: 100, amount: 0 }
  ];

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor() {
  }

  getCoffees() {
    return this.data;
  }

  getCart() {
    return this.cart;
  }

  resetCart() {
    this.cartItemCount.next(0);
    this.cart = [];
  }

  getCartItemCount() {
    return this.cartItemCount;
  }

  addCoffee(coffee) {
    let added = false;
    for (let c of this.cart) {
      if (c.id === coffee.id) {
        c.amount += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      this.cart.push(coffee);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);

  }

  reduceCoffee(coffee) {
    for (let [index, c] of this.cart.entries()) {
      if (c.id === coffee.id) {
        c.amount -= 1;
        if (c.amount == 0) {
          c.amount = 0;
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);

  }

  removeCoffee(coffee) {
    for (let [index, c] of this.cart.entries()) {
      if (c.id === coffee.id) {
        this.cartItemCount.next(this.cartItemCount.value - c.amount);
        c.amount = 0;
        this.cart.splice(index, 1);
      }
    }

  }
}
