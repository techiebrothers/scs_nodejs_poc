import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private Auth: AuthService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let test = (window as { [key: string]: any })["maintenance"] as string;
        if (!test) {
            if (next?.routeConfig?.path === 'login' || next?.routeConfig?.path === 'signup') {
                if (this.Auth.isLoggedIn()) {
                    this.router.navigate(['dashboard']);
                    return false;
                }

                return true;
            } else {
                if (this.Auth.isLoggedIn() && next?.routeConfig?.path === 'maintenance') {
                    this.router.navigate(['dashboard']);
                    return true;
                }

                if (this.Auth.isLoggedIn()) {
                    return true;
                }

                this.router.navigate(['login']);
                return this.Auth.isLoggedIn();
            }
        } else {
            if (next?.routeConfig?.path !== 'maintenance') {
                this.router.navigate(['maintenance']);
            }
            return true;
        }


    }
}
