import { Injectable } from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {

  constructor(private router: Router,
              private service: AppService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (!this.service.isUserAdmin()) {
      this.router.navigate(['login'])
      return false;
    }
    return true;
  }
}
