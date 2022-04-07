import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {MainComponent} from "../main/main.component";

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: []
})
export class AppTopBarComponent {

    items?: MenuItem[];

    constructor(public appMain: MainComponent) { }
}
