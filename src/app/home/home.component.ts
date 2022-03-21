import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import {Product} from "../model/Product";
import {Category} from "../model/Category";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Gösterilecek ürünlerin listesi
  products: Array<Product> | undefined
  // Gösterilecek kategorilerin listesi
  categories: Array<Category> | undefined
  // Seçilen kategori bilgisini tutan değişken
  selectedCategory: string = "0"
  // Arama sorgusunu saklayan değişken
  searchQuery = new FormControl("")

  constructor(public router: Router,
              private service: AppService) { }

  ngOnInit(): void {
    // Tüm ürünleri alıyoruz
    this.getProducts()

    // Tüm kategorileri alıyoruz
    this.service.getCategories().subscribe(categories => {
      this.categories = categories
    })

    // Arama alanına girilen metni dinliyoruz ve arama yapılacak sorguyu gönderiyoruz
    this.searchQuery.valueChanges.pipe(debounceTime(800)).subscribe(() => this.getProducts())
  }

  /**
   * Ürünleri getiren servis
   */
  getProducts() {
    this.service.getProducts(
      this.selectedCategory,
      this.searchQuery.value
    ).subscribe(products => {
      this.products = products
    })
  }

}
