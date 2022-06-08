import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { MenuService } from '../services/menu.service';

@Injectable()
export class AuthRoleGuard implements CanActivate {
    constructor(private router: Router, private Auth: AuthService, public menuService: MenuService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // const expectedRole = next.data.expectedRole;
        // const userRole = crypto.AES.decrypt(localStorage.getItem('user').
        // toString(), environment.encryptionKey).toString(crypto.enc.Utf8);
        // if (expectedRole && userRole) {
            console.log(this.menuService.menuData);
            if (!this.menuService.validateMenuItems(next?.routeConfig?.path)) {
                // if (!expectedRole.includes(userRole)) {
                this.router.navigate(['dashboard']);
                return false;
            }

            return true;
        // }
        // return true;

    }
}
