import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../../shared/services/menu.service';
import { NgbModal, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../../shared/services/loader.service';
import { ApiService } from '../../shared/services/api.service';
import { constant } from '../../constant';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    providers: [NgbCarouselConfig]
})
export class FooterComponent implements OnInit {
    base_url = environment.pathUrl;
    pushRightClass = 'push-right';
    currentPage: any = '';
    bannerList: any = [];
    siteLogo = 'assets/img/logo.png';
    pageLink = '/';
    version: any = '';

    constructor(private translate: TranslateService, public router: Router, public authService: AuthService, private toastr: ToastrService, public menuService: MenuService, private modalService: NgbModal, public config: NgbCarouselConfig, private loader: LoaderService, public apiService: ApiService) {
        this.currentPage = this.router.url.split("/")[1];
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
        this.version = localStorage.getItem('version');

        if (localStorage.getItem('user')) {
            // this.authService.getUserDetail().subscribe(success => {
            //     // this.userDetail = success.data.userDetails;
            // },
            //     err => {
            //         this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
            //             this.toastr.error(res1, '');
            //             this.authService.logOut();
            //         });
            //     });
        }

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() { }

    isToggled(): boolean {
        const dom: any = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        this.authService.logOut();
    }

    changeLang(language: string) {
        this.translate.setDefaultLang(language);
        this.translate.use(language);
    }

    validateMenuItems(menuName: any): Boolean {
        return this.menuService.validateMenuItems(menuName);
    }


}
