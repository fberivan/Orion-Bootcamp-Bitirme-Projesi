import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {BasketComponent} from "./basket/basket.component";
import {ProductComponent} from "./product/product.component";
import {AuthGuard} from "./auth.guard";
import {AlreadyLoggedInGuard} from "./already-logged-in.guard";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AlreadyLoggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AlreadyLoggedInGuard] },
  { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductComponent, canActivate: [AuthGuard] },
  // Tanınmayan tüm url'leri ana sayfaya yönlendir
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
