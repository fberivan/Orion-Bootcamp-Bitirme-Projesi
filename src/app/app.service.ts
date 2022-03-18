import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../environments/environment';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //Giriş yapmış olan kullanıcının bilgilerinin tutulacağı değişken
  user: { mail: "", pass: ""} | undefined

  constructor(private http: HttpClient) {
    // Giriş yapmış kullanıcı verisi varsa onu alıyoruz
    let user = localStorage.getItem("user")
    if (user) {
      // Kullanıcı nesnesini string'den object'e çeviriyoruz
      this.user = JSON.parse(user)
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem("user") != undefined
  }
}
