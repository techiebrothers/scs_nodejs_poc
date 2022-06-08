import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../../services/menu.service';

import { ApiService } from '../../services/api.service';
import { constant } from '../../../constant';
import { NgForm } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegexService } from '../../services/regex.service';
import { environment } from '../../../../environments/environment';
import * as crypto from 'crypto-js';

@Component({
    selector: 'app-reset-password-modal',
    templateUrl: './reset-password-modal.component.html',
    styleUrls: ['./reset-password-modal.component.scss']
})
export class ResetPasswordModalComponent implements OnInit {
    @Input() userId: any;
    resetData = { 'password': '', 'confirmPassword': '', id: '', reset_request: '1', notify: '1' };
    isSubmitted = false;

    constructor(private translate: TranslateService, public router: Router, public authService: AuthService, private toastr: ToastrService, public menuService: MenuService, private modalService: NgbModal, public apiService: ApiService, private loader: LoaderService, private regexService: RegexService, public activeModal: NgbActiveModal) {
        if (localStorage.getItem('user')) {
            this.authService.getUserDetail().subscribe((success: any) => {
            },
                err => {
                    this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                        this.toastr.error(res1, '');
                        this.authService.logOut();
                    });
                });
        }
    }

    ngOnInit() {
        this.resetData.id = this.userId;
        console.log('userId', this.userId);

     }


    onResetPassword() {
        console.log('resetData', this.resetData);
        const data = JSON.parse(JSON.stringify(this.resetData));
        data.password = crypto.AES.encrypt(data.password, environment.encryptionKey).toString();
        this.isSubmitted = true;
        this.apiService.postData(constant.RESET_USER_PASSWORD, data).subscribe((res: any) => {
            Swal.fire({
                icon: res.status,
                text: res.message,
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (res.code === 200) {
                }
            });
            this.loader.setLoading(false);
            this.activeModal.dismiss('submitted');
            return true;
        },
            (err: any) => {
                Swal.fire({
                    icon: 'error',
                    text: err.error['message'],
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                });
                return true;
                this.loader.setLoading(false);
            }
        );
        return true;
    }
}
