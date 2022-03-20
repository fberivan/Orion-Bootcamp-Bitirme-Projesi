import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../environments/environment';
import {BehaviorSubject, catchError, map, NotFoundError, Observable, of, tap} from "rxjs";
import {User} from "./model/User";
import {Product} from "./model/Product";
import {Category} from "./model/Category";
import {ShoppingCart} from "./model/ShoppingCart";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //Giriş yapmış olan kullanıcının bilgilerinin tutulacağı değişken
  user: User | undefined

  // Kullanıcı sepeti
  shoppingCart = new BehaviorSubject<ShoppingCart|undefined>(undefined)

  constructor(private http: HttpClient) {
    this.loadUser()
    this.loadCart()
  }

  private loadUser() {
    // Giriş yapmış kullanıcı verisi varsa onu alıyoruz
    let user = localStorage.getItem("user")
    if (user) {
      // Kullanıcı nesnesini string'den object'e çeviriyoruz
      this.user = JSON.parse(user)
    }
  }

  private loadCart() {
    if (!this.shoppingCart.getValue()) {
      this.getShoppingCart(this.user!.id).subscribe()
    }
  }

  private saveUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user))
    this.user = user
  }

  isLoggedIn(): boolean {
    return localStorage.getItem("user") != undefined
  }

  /**
   * Login olmak için kullanılan servis fonksiyonu
   * @param username Kullanıcı adı
   * @param pass Kullanıcı şifresi
   */
  login(username: string, pass: string): Observable<User|undefined>{
    return this.http.get<Array<User>>(`${environment.API_URL}/users?username=${username}&pass=${pass}`).pipe(
      map(users => {
        if (users.length == 0) throw new NotFoundError("user not found")
        this.saveUser(users[0])
        return users[0]
      }),
      catchError(() => of(undefined))
    )
  }

  /**
   * Kullanıcı kayıt etmek için kullanılan servis fonksiyonu
   * @param user Kayıt edilecek kullanıcı nesnesi
   */
  register(user: User): Observable<User|undefined>{
    return this.http.post<User>(`${environment.API_URL}/users`, user).pipe(
      tap(user => this.saveUser(user)),
      catchError(() => of(undefined))
    )
  }

  createShoppingCart(cart: ShoppingCart): Observable<ShoppingCart|undefined> {
    return this.http.post<ShoppingCart>(`${environment.API_URL}/cart`, cart).pipe(
      tap(cart => this.shoppingCart.next(cart)),
      catchError(() => of(undefined))
    )
  }

  updateShoppingCart(shoppingCart: ShoppingCart): Observable<ShoppingCart|undefined> {
    let cartId = shoppingCart.id
    return this.http.put<ShoppingCart>(`${environment.API_URL}/cart/${cartId}`, shoppingCart).pipe(
      tap(cart => this.shoppingCart.next(cart)),
      catchError(() => of(undefined))
    )
  }

  getShoppingCart(user_id: number | string): Observable<ShoppingCart|undefined> {
    return this.http.get<Array<ShoppingCart>>(`${environment.API_URL}/cart?user_id=${user_id}`).pipe(
      map(carts => {
        if (carts.length == 0) throw new NotFoundError("cart not found")
        this.shoppingCart.next(carts[0])
        return carts[0]
      }),
      catchError(() => of(undefined))
    )
  }

  getProduct(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${environment.API_URL}/products/${id}`)
  }

  getProducts(category_id: string, query: string = ""): Observable<Array<Product>> {
    let url = `${environment.API_URL}/products`
    if (query != "") {
      url += `?name_like=${query}`
    }
    if (category_id != "0") {
      url += url.includes("?") ? `&category_id=${category_id}` : `?category_id=${category_id}`
    }
    return this.http.get<Array<Product>>(url)
  }

  getCategories(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>(`${environment.API_URL}/categories`)
  }
}
