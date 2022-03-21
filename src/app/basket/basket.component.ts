import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {Product} from "../model/Product";
import {Order} from "../model/Order";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  products: Array<Product> = []
  totalPrice = 0

  constructor(private router: Router,
              public service: AppService) { }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {
    this.service.shoppingCart.subscribe(shoppingCart => {
      if (!shoppingCart) return
      this.products = []
      if (shoppingCart.products.length > 0) {
        shoppingCart.products.forEach((value, index) => {
          this.service.getProduct(value).subscribe(product => {
            if (product) {
              this.totalPrice += product.price
              this.products.push(product)
            }
          })
        })
      }
    })
  }

  deleteProduct(product_index: number) {
    let shoppingCart = this.service.shoppingCart.getValue()
    if (shoppingCart && shoppingCart.products.length > 0) {
      shoppingCart.products.splice(product_index, 1)
      this.service.updateShoppingCart(shoppingCart).subscribe(cart => {
        if (!cart) {
          alert("Product cannot add to cart!")
        }
      })
    }
  }

  clearShoppingCart() {
    let shoppingCart = this.service.shoppingCart.getValue()
    if (shoppingCart && shoppingCart.products.length > 0) {
      shoppingCart.products = []
      this.service.updateShoppingCart(shoppingCart).subscribe(cart => {
        if (!cart) {
          alert("Shopping cart cannot cleared!")
        }
      })
    }
  }

  checkOut() {
    let shoppingCart = this.service.shoppingCart.getValue()
    let order = new Order()
    if (shoppingCart && shoppingCart.products.length > 0) {
      order.user_id = shoppingCart.user_id
      order.products = shoppingCart.products
      order.totalPrice = this.totalPrice
      order.date = new Date()
      this.service.createOrder(order).subscribe(res => {
        if (res) {
          alert("Your order successfully created!")
          this.clearShoppingCart()
        } else {
          alert("Order create error occurred!")
        }
      })
    }
  }

}
