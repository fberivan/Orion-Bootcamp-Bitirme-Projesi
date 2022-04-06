import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInGuard implements CanActivate {

  constructor(private service: AppService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.service.isLoggedIn()) {
      // Kullanıcı giriş yapmış, home ekranına yönlendiriyoruz
      this.router.navigate(['home'])
      return false;
    }
    return true;
  }

}
