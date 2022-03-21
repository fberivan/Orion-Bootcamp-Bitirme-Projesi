import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import {Product} from "../model/Product";
import {Order} from "../model/Order";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  // Sepetteki ürünlerin listesi
  products: Array<Product> = []
  // Sepetteki ürünlerin toplam fiyatı
  totalPrice = 0

  constructor(public service: AppService) { }

  ngOnInit(): void {
    this.getProducts()
  }

  /**
   * Id bilgilerini kullanarak sepetteki ürünleri
   */
  getProducts() {
    // Sepetteki değişiklikleri dinliyoruz
    this.service.shoppingCart.subscribe(shoppingCart => {
      if (!shoppingCart) return
      this.products = []
      if (shoppingCart.products.length > 0) {
        // Her ürün için istek atıp ürün nesnesini alıyoruz
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

  /**
   * Sepetten ürün silme
   * @param product_index Silicenek ürünün id'si
   */
  deleteProduct(product_index: number) {
    let shoppingCart = this.service.shoppingCart.getValue()
    if (shoppingCart && shoppingCart.products.length > 0) {
      // Ürünü listeden çıkarıyoruz
      shoppingCart.products.splice(product_index, 1)
      // Sunucuda sepeti güncelliyoruz
      this.service.updateShoppingCart(shoppingCart).subscribe(cart => {
        if (!cart) {
          alert("Product cannot add to cart!")
        }
      })
    }
  }

  /**
   * Sepetteki ürünlerin hepsini siliyoruz
   */
  clearShoppingCart() {
    let shoppingCart = this.service.shoppingCart.getValue()
    if (shoppingCart && shoppingCart.products.length > 0) {
      shoppingCart.products = []
      // Sunucuda sepeti güncelliyoruz
      this.service.updateShoppingCart(shoppingCart).subscribe(cart => {
        if (!cart) {
          alert("Shopping cart cannot cleared!")
        }
      })
    }
  }

  /**
   * Sipariş verme işlemi
   */
  checkOut() {
    let shoppingCart = this.service.shoppingCart.getValue()
    if (shoppingCart && shoppingCart.products.length > 0) {
      // Sipariş nesnesini oluşturuyoruz
      let order = new Order()
      order.user_id = shoppingCart.user_id
      order.products = shoppingCart.products
      order.totalPrice = this.totalPrice
      order.date = new Date()
      // Sunucuda sipariş nesnesini oluşturuyoruz
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
