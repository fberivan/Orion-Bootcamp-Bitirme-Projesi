import { Component, OnInit } from '@angular/core';
import {Product} from "../../model/Product";
import {ConfirmationService, MessageService, SelectItem} from "primeng/api";
import {AppService} from "../../app.service";

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['../../../assets/demo/badges.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ProductsComponent implements OnInit {
  products: Product[];

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;

  constructor(private service: AppService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {}

  ngOnInit() {
    this.service.getProducts("0").subscribe(data => this.products = data);
    if (!this.service.categories) {
      this.service.getCategories().subscribe(() => console.debug("Categories received!"));
    }

    this.sortOptions = [
      {label: 'Price High to Low', value: '!price'},
      {label: 'Price Low to High', value: 'price'}
    ];
  }

  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  getCategoryName(id: number): string {
    let category = this.service.categories?.filter(category => category.id == id)
    if (category && category.length != 0) {
      return category[0].name
    }
    return "Unknown"
  }

  confirmDelete(event: Event, product: Product) {
    this.confirmationService.confirm({
      key: 'confirmDelete',
      target: event.target,
      message: `Are you sure you want to delete "${product.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'You have accepted'});
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

}
