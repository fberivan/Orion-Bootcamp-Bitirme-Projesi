import { Component, OnInit } from '@angular/core';
import {Product} from "../../model/Product";
import {ConfirmationService, MessageService} from "primeng/api";
import {AppService} from "../../app.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../model/Category";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './edit_product.component.html',
  styleUrls: ['../../../assets/demo/badges.scss'],
  providers: [ConfirmationService, MessageService]
})
export class EditProductComponent implements OnInit {

  product: Product;

  selectedCategory: Category;

  // FormGroup nesnesi
  editForm = new FormGroup({
    // form alanları için validator'lar
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    image: new FormControl('', [Validators.required]),
    summary: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    price: new FormControl('', [Validators.required]),
  });

  constructor(public service: AppService,
              private router: Router,
              private route: ActivatedRoute,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {}

  ngOnInit() {
    // Kategorileri alıyoruz
    if (!this.service.categories) {
      this.service.getCategories().subscribe(() => this.getProduct());
    } else {
      this.getProduct()
    }
  }

  private getProduct() {
    // Url'den id parametresini alıyoruz
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id")?.toString() ?? "-1"
      // İstenen id'ye ait ürün nesnesini servisten alıyoruz
      this.service.getProduct(id).subscribe(product => {
        this.product = product
        let category = this.service.categories.filter(category => category.id == product.category_id)
        this.selectedCategory = category[0];
        this.editForm.patchValue(product);
      })
    });
  }

  onSubmit() {
    // form değerlerinin object olarak alınması
    let product: Product = this.editForm.value;
    this.product.name = product.name
    this.product.summary = product.summary
    this.product.image = product.image
    this.product.price = product.price
    this.product.description = product.description
    this.product.category_id = this.selectedCategory.id
    this.service.updateProduct(this.product).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Success', detail: `"${product.name}" successfully updated.` });
      } else {
        alert("Product create error occurred!")
      }
    })
  }

  // form içerisindeki name alanına erişimi saplayan get fonksiyonu
  get name() { return this.editForm.get('name')!; }

  // form içerisindeki image alanına erişimi saplayan get fonksiyonu
  get image() { return this.editForm.get('image')!; }

  // form içerisindeki summary alanına erişimi saplayan get fonksiyonu
  get summary() { return this.editForm.get('summary')!; }

  // form içerisindeki description alanına erişimi saplayan get fonksiyonu
  get description() { return this.editForm.get('description')!; }

  // form içerisindeki price alanına erişimi saplayan get fonksiyonu
  get price() { return this.editForm.get('price')!; }

}
