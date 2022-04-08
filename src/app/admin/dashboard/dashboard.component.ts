import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public service: AppService) { }

  ngOnInit(): void {
  }

}
