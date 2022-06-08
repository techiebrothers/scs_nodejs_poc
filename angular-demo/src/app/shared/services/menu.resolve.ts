import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MenuService } from './menu.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MenuResolve implements Resolve<any> {
    constructor(private menuService: MenuService, public Auth: AuthService, public router: Router) {

    }
    resolve(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const menuCall = this.menuService.resolveMenu();
        console.log('next?.routeConfig?.path', next?.routeConfig?.path);
        var reset_request = localStorage.getItem("reset_request") || false;
        if (this.Auth.isLoggedIn() && reset_request && next?.routeConfig?.path !== 'change-password') {
            this.router.navigate(['change-password']);
        }
        if (menuCall !== undefined && menuCall !== null) {
            return menuCall.pipe(map((res: any) => {
                this.Auth.setUserDetail(res.data.userDetails);
            }, (err: any) => {
                console.log(err);
            }));
        } else {
        }
    }
}


