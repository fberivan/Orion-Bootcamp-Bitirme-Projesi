import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MainComponent} from "./main/main.component";
import {ProductsComponent} from "./products/products.component";

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
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
