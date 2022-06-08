import { Component, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
import { routerTransition } from './../../router.animations';

import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { RegexService } from '../../shared/services/regex.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    // animations: [routerTransition()]
})
export class ForgotPasswordComponent implements OnInit {
    loginData = { 'email': '' };
    emailPattern: RegExp;
    isSubmitted = false;

    constructor(private translate: TranslateService,
        public router: Router, private authService: AuthService, private toastr: ToastrService, private regexService: RegexService) {
        this.emailPattern = regexService.pattern.emailPattern;

    }

    ngOnInit() {
    }

    onForgot() {
        this.isSubmitted = true;
        this.authService.forgotPassword(this.loginData).subscribe((success: any) => {
            this.translate.get('Forgot Password Success').subscribe((res1: string) => {
                // this.toastr.success(res1, '');
                Swal.fire({
                    // title: 'SUCCESS',
                    text: res1,
                    icon: success.status,
                }).then((result: any) => {
                });
            });
            this.router.navigate(['login']);
        },
            err => {
                this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                    // this.toastr.error(res1, '');
                    Swal.fire({
                        // title: 'error',
                        text: res1,
                        icon: 'error',
                    }).then((result: any) => {
                    });
                });
            });
    }

}
