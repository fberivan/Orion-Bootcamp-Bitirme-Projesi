import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../model/Product";
import {AppService} from "../app.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product | undefined

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: AppService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id")?.toString() ?? "-1"
      this.service.getProduct(id).subscribe(product => {
        this.product = product
      })
    });
  }

  addToCart() {
    if (this.product) {
      let shoppingCart = this.service.shoppingCart.getValue()
      if (!shoppingCart) return
      shoppingCart.products.push(this.product.id)
      this.service.shoppingCart.next(shoppingCart)
      this.service.updateShoppingCart(shoppingCart).subscribe(cart => {
        if (cart) {
          this.router.navigate(['basket'])
        } else {
          alert("Product cannot add to cart!")
        }
      })
    }
  }

}
