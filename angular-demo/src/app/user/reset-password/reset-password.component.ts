import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from './../../router.animations';

import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    // animations: [routerTransition()]
})
export class ResetPasswordComponent implements OnInit {
    resetData = { 'password': '', 'confirmPassword': '' };
    isSubmitted = false;

    constructor(private translate: TranslateService, public router: Router, private authService: AuthService, private toastr: ToastrService) {
        this.authService.validateResetToken(this.router.routerState.snapshot.root.queryParams['token']).subscribe(success => { },
            err => {
                this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                    this.toastr.error(res1, '');
                });
                this.router.navigate(['login']);
            });
    }

    ngOnInit() {
    }

    onResetPassword() {
        this.isSubmitted = true;
        this.authService.resetPassword(this.resetData, this.router.routerState.snapshot.root.queryParams['token']).subscribe(success => {
            this.translate.get('Reset Success').subscribe((res1: string) => {
                // this.toastr.success(res1, '');
                Swal.fire({
                    // title: 'Success',
                    text: res1,
                    icon: 'success',
                }).then((result: any) => {
                    this.router.navigate(['login']);
                });
            });
        },
            err => {
                this.resetData.password = '';
                this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                    // this.toastr.error(res1, '');
                    Swal.fire({
                        // title: '',
                        text: res1,
                        icon: 'error',
                    }).then((result: any) => {
                    });
                });
            });
    }
}
