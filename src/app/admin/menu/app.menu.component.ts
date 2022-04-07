import { Component, OnInit } from '@angular/core';
import {MainComponent} from "../main/main.component";

@Component({
  selector: 'app-menu',
  template: `
      <div class="layout-menu-container">
          <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
              <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                  <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                  <ul role="menu">
                      <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                  </ul>
              </li>
          </ul>
      </div>
  `
})
export class AppMenuComponent implements OnInit {

    model?: any[];

    constructor(public appMain: MainComponent) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items:[
                    {label: 'Dashboard',icon: 'pi pi-fw pi-home', routerLink: ['/admin']}
                ]
            },
            {
                label: 'Pages',
                items: [
                    {label: 'Products', icon: 'pi pi-fw pi-th-large', routerLink: ['/admin/products']}
                ]
            }
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
