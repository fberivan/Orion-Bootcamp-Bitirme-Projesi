import { Component, OnInit } from '@angular/core';
import {Product} from "../../model/Product";
import {ConfirmationService, MessageService} from "primeng/api";
import {AppService} from "../../app.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../model/Category";
import {Router} from "@angular/router";

@Component({
  templateUrl: './new_product.component.html',
  styleUrls: ['../../../assets/demo/badges.scss'],
  providers: [ConfirmationService, MessageService]
})
export class NewProductComponent implements OnInit {

  selectedCategory: Category;

  URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

  // FormGroup nesnesi
  createForm = new FormGroup({
    // form alanları için validator'lar
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    image: new FormControl('', [Validators.required, Validators.pattern(this.URL_REGEXP)]),
    summary: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    price: new FormControl('', [Validators.required]),
  });

  constructor(public service: AppService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {}

  ngOnInit() {
    if (!this.service.categories) {
      this.service.getCategories().subscribe(() => console.debug("Categories received!"));
    }
  }

  onSubmit() {
    // form değerlerinin object olarak alınması
    let product: Product = this.createForm.value;
    product.category_id = this.selectedCategory.id
    this.service.createProduct(product).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Success', detail: `"${product.name}" successfully created.` });
        this.createForm.reset()
      } else {
        alert("Product create error occurred!")
      }
    })
  }

  // form içerisindeki name alanına erişimi saplayan get fonksiyonu
  get name() { return this.createForm.get('name')!; }

  // form içerisindeki image alanına erişimi saplayan get fonksiyonu
  get image() { return this.createForm.get('image')!; }

  // form içerisindeki summary alanına erişimi saplayan get fonksiyonu
  get summary() { return this.createForm.get('summary')!; }

  // form içerisindeki description alanına erişimi saplayan get fonksiyonu
  get description() { return this.createForm.get('description')!; }

  // form içerisindeki price alanına erişimi saplayan get fonksiyonu
  get price() { return this.createForm.get('price')!; }

}
