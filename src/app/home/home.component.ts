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

  products: Array<Product> | undefined
  categories: Array<Category> | undefined
  selectedCategory: string = "0"
  searchQuery = new FormControl("")

  constructor(public router: Router, private service: AppService) { }

  ngOnInit(): void {
    this.getProducts()

    this.service.getCategories().subscribe(categories => {
      this.categories = categories
    })

    this.searchQuery.valueChanges.pipe(debounceTime(800)).subscribe(() => this.getProducts())
  }

  getProducts() {
    this.service.getProducts(
      this.selectedCategory,
      this.searchQuery.value
    ).subscribe(products => {
      this.products = products
    })
  }

}
