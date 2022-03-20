import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {Product} from "../model/Product";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  products: Array<Product> = []

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
              this.products.push(product)
            }
          })
        })
      }
    })
  }

  deleteProduct(product_id: number) {
    let shoppingCart = this.service.shoppingCart.getValue()
    if (shoppingCart && shoppingCart.products.length > 0) {
      shoppingCart.products = shoppingCart.products.filter(obj => { return obj !== product_id })
      this.service.updateShoppingCart(shoppingCart).subscribe(cart => {
        if (!cart) {
          alert("Product cannot add to cart!")
        }
      })
    }
  }

}
