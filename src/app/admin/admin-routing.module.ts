import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MainComponent} from "./main/main.component";
import {ProductsComponent} from "./products/products.component";
import {NewProductComponent} from "./new_product/new_product.component";
import {EditProductComponent} from "./edit_product/edit_product.component";

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'create-product', component: NewProductComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
    ]
  },
  // Tanınmayan tüm url'leri ana sayfaya yönlendir
  { path: '**', redirectTo: '/admin' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
