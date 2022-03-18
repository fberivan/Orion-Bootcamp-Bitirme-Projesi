import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AppService} from "../app.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
              private service: AppService) { }

  ngOnInit(): void {
    if (!this.service.isLoggedIn()) {
      // Kullanıcı giriş yapmamış, login ekranına yönlendiriyoruz
      this.router.navigate(['login'])
    }
  }

}
