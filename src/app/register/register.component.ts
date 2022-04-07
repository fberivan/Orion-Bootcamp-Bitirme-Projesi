import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {ShoppingCart} from "../model/ShoppingCart";
import {User} from "../model/User";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../shared/front_side.scss',
    '../shared/login_register.css'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {

  // Hata mesajını saklayan değişken
  submitError: string | undefined

  // FormGroup nesnesi
  registerForm = new FormGroup({
    // username alanı için validator'lar
    username: new FormControl('', [Validators.required,  Validators.minLength(3)]),
    // şifre alanı için validator'lar
    pass: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private service: AppService,
              private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Register formu submit edildiğinde çalışır
   */
  onSubmit() {
    // form değerlerinin object olarak alınması
    let user = this.registerForm.value
    // kayıt olmak için servis isteği
    this.service.register(user).subscribe(registeredUser => {
      // objenin property'leri yoksa hata alınmış demektir
      if (!registeredUser){
        this.submitError = "User cannot created!"
        this.registerForm.reset()
      } else {
        this.createShoppingCart(registeredUser as User)
      }
    })
  }

  /**
   * Verilen kullanıcı için alışveriş sepeti oluşturur
   * @param user Kullanıcı nesnesi
   */
  createShoppingCart(user: User) {
    // Kullanıcı için alışveriş sepeti nesnesi
    let cart = new ShoppingCart()
    cart.user_id = user.id
    cart.products = []
    this.service.createShoppingCart(cart).subscribe(cart => {
      if (cart) {
        this.router.navigate(['home'])
      } else {
        this.submitError = "User created, but shopping cart not created!"
        this.registerForm.disable()
        setTimeout(() => {
          this.router.navigate(['login'])
        }, 3000)
      }
    })
  }

  // form içerisindeki username alanına erişimi saplayan get fonksiyonu
  get username() { return this.registerForm.get('username')!; }

  // form içerisindeki pass alanına erişimi saplayan get fonksiyonu
  get pass() { return this.registerForm.get('pass')!; }
}
