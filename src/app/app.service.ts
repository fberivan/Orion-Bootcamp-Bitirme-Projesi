import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //Giriş yapmış olan kullanıcının bilgilerinin tutulacağı değişken
  user: { username: "", pass: ""} | undefined

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

  /**
   * Login olmak için kullanılan servis fonksiyonu
   * @param username Kullanıcı adı
   * @param pass Kullanıcı şifresi
   */
  login(username: string, pass: string): Observable<any>{
    return this.http.get(`${environment.API_URL}/users?mail=${username}&pass=${pass}`)
  }

  /**
   * Kullanıcı kayıt etmek için kullanılan servis fonksiyonu
   * @param user Kayıt edilecek kullanıcı nesnesi
   */
  register(user: any): Observable<any>{
    return this.http.post(`${environment.API_URL}/users`, user)
  }
}
