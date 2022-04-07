import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../model/Product";
import {AppService} from "../app.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: [
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../shared/front_side.scss',
    './product.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit {

  // Detayları gösterilecek ürün nesnesi
  product: Product | undefined

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: AppService) { }

  ngOnInit(): void {
    // Url'den id parametresini alıyoruz
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id")?.toString() ?? "-1"
      // İstenen id'ye ait ürün nesnesini servisten alıyoruz
      this.service.getProduct(id).subscribe(product => {
        this.product = product
      })
    });
  }

  /**
   * Ürünü sepete eklemek için kullanılıyor
   */
  addToCart() {
    // Ürün bilgileri var mı kontrol ediyoruz
    if (this.product) {
      let shoppingCart = this.service.shoppingCart.getValue()
      if (!shoppingCart) return
      // İlgili ürünün id'sini sepete ekliyoruz
      shoppingCart.products.push(this.product.id)
      this.service.shoppingCart.next(shoppingCart)
      // Sepeti sunucu tarafında güncelliyoruz
      this.service.updateShoppingCart(shoppingCart).subscribe(cart => {
        if (cart) {
          // Ürün sepete eklendi, sepet sayfasına gidiyoruz
          this.router.navigate(['basket'])
        } else {
          alert("Product cannot add to cart!")
        }
      })
    }
  }

}
