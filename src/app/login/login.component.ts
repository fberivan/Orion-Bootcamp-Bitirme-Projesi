import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AppService} from "../app.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../shared/login_register.css']
})
export class LoginComponent implements OnInit {

  // Hata mesajını saklayan değişken
  submitError: string | undefined

  // FormGroup nesnesi
  loginForm = new FormGroup({
    // username alanı için validator'lar
    username: new FormControl('', [Validators.required,  Validators.minLength(3)]),
    // şifre alanı için validator'lar
    pass: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private service: AppService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      // Kullanıcı giriş yapmış, home ekranına yönlendiriyoruz
      this.router.navigate(['home'])
    }
  }

  onSubmit() {
    // form değerlerinin object olarak alınması
    let user = this.loginForm.value
    // login olmak için servis isteği
    this.service.login(user.username, user.pass).subscribe(res => {
      // res nesnesi array olarak gelmektedir, içinde eleman yoksa kullanıcı bulunamamıştır
      if(res.length != 0){
        localStorage.setItem("user", JSON.stringify(res[0]))
        this.router.navigate(['home'])
      }else{
        this.submitError = "Wrong user credentials!"
        this.loginForm.reset()
      }
    })
  }

  // form içerisindeki mail alanına erişimi saplayan get fonksiyonu
  get username() { return this.loginForm.get('username')!; }

  // form içerisindeki pass alanına erişimi saplayan get fonksiyonu
  get pass() { return this.loginForm.get('pass')!; }
}
