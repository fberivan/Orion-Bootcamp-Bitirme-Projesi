import {Component, AfterViewInit, OnDestroy, Renderer2, OnInit, ViewEncapsulation} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AppConfig} from "../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../service/app.config.service";
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [
    '../../../assets/theme/lara-light-indigo/theme.css',
    '../shared/admin_side.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('submenu', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class MainComponent implements AfterViewInit, OnDestroy, OnInit {

  public menuInactiveDesktop?: boolean;

  public menuActiveMobile?: boolean;

  public overlayMenuActive?: boolean;

  public staticMenuInactive: boolean = false;

  public profileActive?: boolean;

  public topMenuActive?: boolean;

  public topMenuLeaving?: boolean;

  public theme?: string;

  documentClickListener?: () => void;

  menuClick?: boolean;

  topMenuButtonClick?: boolean;

  configActive?: boolean;

  configClick?: boolean;

  config!: AppConfig;

  subscription?: Subscription;

  menuMode = 'static';

  constructor(public renderer: Renderer2, private primengConfig: PrimeNGConfig, public configService: ConfigService) { }

  ngOnInit() {
    this.config = this.configService.config;
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '14px';
    this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);
  }

  ngAfterViewInit() {
    // hides the overlay menu and top menu if outside is clicked
    this.documentClickListener = this.renderer.listen('body', 'click', () => {
      if (!this.isDesktop()) {
        if (!this.menuClick) {
          this.menuActiveMobile = false;
        }

        if (!this.topMenuButtonClick) {
          this.hideTopMenu();
        }
      }
      else {
        if (!this.menuClick && this.isOverlay()) {
          this.menuInactiveDesktop = true;
        }
        if (!this.menuClick){
          this.overlayMenuActive = false;
        }
      }

      if (this.configActive && !this.configClick) {
        this.configActive = false;
      }

      this.configClick = false;
      this.menuClick = false;
      this.topMenuButtonClick = false;
    });
  }

  toggleMenu(event: Event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.menuMode === 'overlay') {
        if(this.menuActiveMobile === true) {
          this.overlayMenuActive = true;
        }

        this.overlayMenuActive = !this.overlayMenuActive;
        this.menuActiveMobile = false;
      }
      else if (this.menuMode === 'static') {
        this.staticMenuInactive = !this.staticMenuInactive;
      }
    }
    else {
      this.menuActiveMobile = !this.menuActiveMobile;
      this.topMenuActive = false;
    }

    event.preventDefault();
  }

  toggleProfile(event: Event) {
    this.profileActive = !this.profileActive;
    event.preventDefault();
  }

  toggleTopMenu(event: Event) {
    this.topMenuButtonClick = true;
    this.menuActiveMobile = false;

    if (this.topMenuActive) {
      this.hideTopMenu();
    } else {
      this.topMenuActive = true;
    }

    event.preventDefault();
  }

  hideTopMenu() {
    this.topMenuLeaving = true;
    setTimeout(() => {
      this.topMenuActive = false;
      this.topMenuLeaving = false;
    }, 1);
  }

  onMenuClick() {
    this.menuClick = true;
  }

  onConfigClick() {
    this.configClick = true;
  }

  isStatic() {
    return this.menuMode === 'static';
  }

  isOverlay() {
    return this.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile(){
    return window.innerWidth < 1024;
  }

  onSearchClick() {
    this.topMenuButtonClick = true;
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }


    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
