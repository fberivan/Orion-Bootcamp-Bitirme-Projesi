import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private service: AppService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.service.isLoggedIn()) {
      // Kullanıcı giriş yapmamış, login ekranına yönlendiriyoruz
      this.router.navigate(['login'])
      return false;
    }
    return true;
  }

}
