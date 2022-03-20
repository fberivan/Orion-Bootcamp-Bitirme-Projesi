import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AppService} from "../app.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
              public service: AppService) { }

  ngOnInit(): void {
    if (!this.service.isLoggedIn()) {
      // Kullanıcı giriş yapmamış, login ekranına yönlendiriyoruz
      this.router.navigate(['login'])
    }
  }

  logOut() {
    // Kullanıcı bilgilerini siliyoruz
    localStorage.removeItem("user")
    this.service.user = undefined
    // Login ekranına yönlendiriyoruz
    this.router.navigate(['login'])
  }

}
