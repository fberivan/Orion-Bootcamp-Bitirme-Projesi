import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import {ConfigService} from "./service/app.config.service";
import {AppFooterComponent} from "./footer/app.footer.component";
import {AppMenuComponent} from "./menu/app.menu.component";
import {AppTopBarComponent} from "./topbar/app.topbar.component";
import {MenuService} from "./service/app.menu.service";
import {AppMenuitemComponent} from "./menu/app.menuitem.component";
import {ProductsComponent} from "./products/products.component";

import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {ToastModule} from "primeng/toast";
import {NewProductComponent} from "./new_product/new_product.component";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RippleModule} from "primeng/ripple";
import {EditProductComponent} from "./edit_product/edit_product.component";

@NgModule({
  declarations: [
    DashboardComponent,
    MainComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    ProductsComponent,
    NewProductComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DataViewModule,
    DropdownModule,
    RatingModule,
    ButtonModule,
    PickListModule,
    OrderListModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    InputTextareaModule,
    RippleModule,
    ReactiveFormsModule
  ],
  providers: [
    MenuService,
    ConfigService
  ]
})
export class AdminModule { }
