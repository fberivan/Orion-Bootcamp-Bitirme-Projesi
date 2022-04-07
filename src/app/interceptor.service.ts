import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Giriş yapmış kullanıcı verisi varsa onu alıyoruz
    let user = localStorage.getItem("user")
    if (user) {
      // Kullanıcı nesnesini string'den object'e çeviriyoruz
      let token = JSON.parse(user)?.token
      if (token) {
        const tokenizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
        return next.handle(tokenizedReq);
      }
    }
    return next.handle(req);
  }
}
