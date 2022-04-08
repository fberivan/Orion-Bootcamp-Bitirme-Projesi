import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../environments/environment';
import {BehaviorSubject, catchError, map, NotFoundError, Observable, of, tap} from "rxjs";
import {User} from "./model/User";
import {Product} from "./model/Product";
import {Category} from "./model/Category";
import {ShoppingCart} from "./model/ShoppingCart";
import {Order} from "./model/Order";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //Giriş yapmış olan kullanıcının bilgilerinin tutulacağı değişken
  user: User | undefined

  // Ürün kategori listesi
  categories: Array<Category> | undefined

  // Kullanıcı sepeti
  shoppingCart = new BehaviorSubject<ShoppingCart|undefined>(undefined)

  constructor(private http: HttpClient) {
    this.loadUser()
    this.loadCart()
  }

  /**
   * LocalStorage'da kayıtlı kullanıcı verisi varsa değişkene yüklüyoruz
   */
  private loadUser() {
    // Giriş yapmış kullanıcı verisi varsa onu alıyoruz
    let user = localStorage.getItem("user")
    if (user) {
      // Kullanıcı nesnesini string'den object'e çeviriyoruz
      this.user = JSON.parse(user)
    }
  }

  /**
   * Kullanıcı sepet bilgileri yoksa almak için api isteği atıyoruz
   */
  private loadCart() {
    if (!this.shoppingCart.getValue() && this.user) {
      this.getShoppingCart(this.user!.id).subscribe()
    }
  }

  /**
   * Kullanıcıyı LocalStorage'a kayıt ediyoruz
   * @param user Kayıt edilecek kullanıcı nesnesi
   */
  private saveUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user))
    this.user = user
  }

  /**
   * LocalStorage'da kullanıcı verisi varsa true döner, yoksa false
   */
  isLoggedIn(): boolean {
    return localStorage.getItem("user") != undefined
  }

  /**
   * Kullanıcının admin yetkisi varsa true döner, yoksa false
   */
  isUserAdmin(): boolean {
    let user = localStorage.getItem("user")
    if (user == undefined) return false;

    this.user = JSON.parse(user)
    return this.user?.is_admin == true
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

  /**
   * Kullanıcı sepeti oluşturma servisi
   * @param cart Kullanıcı sepet nesnesi
   */
  createShoppingCart(cart: ShoppingCart): Observable<ShoppingCart|undefined> {
    return this.http.post<ShoppingCart>(`${environment.API_URL}/cart`, cart).pipe(
      tap(cart => this.shoppingCart.next(cart)),
      catchError(() => of(undefined))
    )
  }

  /**
   * Kullanıcı sepeti güncelleme servisi
   * @param cart Kullanıcı sepet nesnesi
   */
  updateShoppingCart(cart: ShoppingCart): Observable<ShoppingCart|undefined> {
    return this.http.put<ShoppingCart>(`${environment.API_URL}/cart/${cart.id}`, cart).pipe(
      tap(updatedCart => this.shoppingCart.next(updatedCart)),
      catchError(() => of(undefined))
    )
  }

  /**
   * Verilen kullanıcı id'si ile sepet bilgilerini getiren servis
   * @param user_id Kullanıcı id'si
   */
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

  /**
   * Id'si verilen ürünün bilgilerini getiren servis
   * @param id Bilgileri alınacak ürün id'si
   */
  getProduct(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${environment.API_URL}/products/${id}`)
  }

  /**
   * Id'si verilen ürünü silen servis
   * @param id Silinecek ürün id'si
   */
  deleteProduct(id: string | number): Observable<Product|undefined> {
    return this.http.delete<Product>(`${environment.API_URL}/products/${id}`).pipe(
      catchError(() => of(undefined))
    )
  }

  /**
   * Verilen parametre değerlerine göre ürünleri getiren servis
   * @param category_id 0 ise tüm kategoriler getirilir, değilse istenen kategori ile filtreler
   * @param query Boş ise tüm ürünler getirilir, dolu ise verilen değerin ürün adında geçtiği tüm ürünleri filtreler
   */
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

  /**
   * Tüm kategorileri getirir
   */
  getCategories(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>(`${environment.API_URL}/categories`).pipe(
      tap(categories => this.categories = categories)
    )
  }

  /**
   * Sepetten yapılan satın alma işleminin sipariş kaydını oluşturur
   * @param order Sipariş bilgilerini içeren nesne
   */
  createOrder(order: Order): Observable<Order|undefined> {
    return this.http.post<Order>(`${environment.API_URL}/orders`, order).pipe(
      catchError(() => of(undefined))
    )
  }

  /**
   * Yeni ürün oluşturur
   * @param product Ürün bilgilerini içeren nesne
   */
  createProduct(product: Product): Observable<Product|undefined> {
    return this.http.post<Product>(`${environment.API_URL}/products`, product).pipe(
      catchError(() => of(undefined))
    )
  }

  /**
   * Ürün güncelleme servisi
   * @param product Ürün bilgilerini içeren nesne
   */
  updateProduct(product: Product): Observable<Product|undefined> {
    return this.http.put<Product>(`${environment.API_URL}/products/${product.id}`, product).pipe(
      catchError(() => of(undefined))
    )
  }
}
