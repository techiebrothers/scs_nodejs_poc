import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from './../../router.animations';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { RegexService } from '../../shared/services/regex.service';
import { MenuService } from '../../shared/services/menu.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ApiService } from '../../shared/services/api.service';
import { constant } from '../../constant';
import { NgForm } from '@angular/forms';
import { LoaderService } from '../../shared/services/loader.service';
import { environment } from '../../../environments/environment';
import * as crypto from 'crypto-js';

import * as _moment from 'moment';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    // animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    loginData = { 'email': '', 'password': '', userid_type_id: 0 };
    emailPattern: RegExp;
    isSubmitted = false;
    closeResult = '';
    isLoading: any = false;

    /* 
        reportData: any = {
            report_category: '',
            name: '',
            email: '',
            phone: '',
            description: '',
            image: {}
        };
        reportCategoryList: any = [
            { title: 'Change password', value: 'change_password' },
            { title: 'Forgot password', value: 'forgot_password' },
            { title: 'Login', value: 'login' }
        ];
        accept_file: any = {
            image: [".png", ".jpeg", ".jpg"]
        }
        allowMaxFileSize = 102400;
        imageSrc: any; */


    constructor(private translate: TranslateService, public router: Router,
        private authService: AuthService, private toastr: ToastrService,
        private regexService: RegexService, public menuService: MenuService, private modalService: NgbModal, public apiService: ApiService, private loader: LoaderService) {
        this.emailPattern = regexService.pattern.emailPattern;
        this.authService.userDetail = { id: '', name: '', email: '', access: [], access_ids: '', access_role: [], profile_picture: { file_src: '' }, module_columns: [], bannerList: [] };
    }


    ngOnInit() { }

    onLoggedin() {
        this.isSubmitted = true;
        this.isLoading = true;
        this.authService.checkLogin(this.loginData).subscribe(success => {
            localStorage.setItem("tokenExpired", moment.utc().unix());
            localStorage.setItem('authToken', success['data'][0].token);
            localStorage.setItem('user', success['data'][0].user);
            // this.authService.getUserDetail().subscribe((success: any) => {
                this.router.navigate(['dashboard']);
            // },
            //     err => {
            //         this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
            //             this.toastr.error(res1, '');
            //             this.authService.logOut();
            //         });
            //     });
            this.isLoading = false;
        },
            err => {
                this.isLoading = false;
                // this.loginData.password = '';
                document.getElementById("password")?.focus();
                /* this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                    this.toastr.error(res1, '');
                }); */
                Swal.fire({
                    icon: 'error',
                    // title: '',
                    text: err.error['message'],
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                });
            });
    }

    openModal() {
        // const modalRef = this.modalService.open(ReportIssueComponent);
        //compConst.componentInstance.weight = undefined;
        // modalRef.componentInstance.openFrom = 'login';
    }
    /* 
        open(content: any) {
            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    
        private getDismissReason(reason: any): string {
            if (reason === ModalDismissReasons.ESC) {
                return 'by pressing ESC';
            } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                return 'by clicking on a backdrop';
            } else {
                return `with: ${reason}`;
            }
        }
    
        async fileChangeEvent(fileInput: any) {
    
            if ((fileInput.target.files as Array<File>).length > 5 || this.reportData.image.length >= 5) {
                fileInput.srcElement.value = null;
                Swal.fire({
                    icon: 'error',
                    // title: '',
                    text: 'Max 5 images allow to upload',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                });
                return true;
            } else {
                if (fileInput.target.files.length) {
                    const element: File = fileInput.target.files[0];
    
                    const ext = element.name.substring(element.name.lastIndexOf('.'));
                    if (this.accept_file['image'].findIndex((item: any) => item.toLowerCase() == ext.toLowerCase()) < 0) {
                        fileInput.srcElement.value = null;
                        Swal.fire({
                            icon: 'error',
                            // title: '',
                            text: `Please select the appropriate ${'image'} with respective format (${this.accept_file['image'].toString()}).`,
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                        });
                        return true;
                    } else {
                        if (element.size > this.allowMaxFileSize && this.accept_file['image'].findIndex((item: any) => item == ext.toLowerCase()) >= 0) {
                            fileInput.srcElement.value = null;
                            Swal.fire({
                                icon: 'error',
                                // title: '',
                                text: `Ensure that the size of Image is not more than ${this.allowMaxFileSize / 1024} KB and preferred dimension 800*450.`,
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                            });
                            return true;
                        }
    
                        const file = element;
                        const reader = new FileReader();
                        reader.onload = e => {
                            this.imageSrc = reader.result;
                            let item: Object = {
                                file: fileInput.target.files,
                                file_name: element.name,
                                file_src: this.imageSrc,
                            };
                            this.reportData.image = item;
                            console.log('this.reportData.image', this.reportData.image);
    
                        }
                        reader.readAsDataURL(file);
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        removeFile() {
            this.reportData.image = {};
        }
        submitReportIssue(form: NgForm) {
    
            console.log('onSave', this.reportData);
            if (this.reportData.image.length < 1) {
                Swal.fire({
                    icon: 'error',
                    // title: '',
                    text: "Image  is required",
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                });
                return true;
            }
            this.loader.setLoading(true);
            const formData = new FormData();
    
            formData.append('report_category', this.reportData.report_category);
            formData.append('name', this.reportData.name);
            formData.append('email', this.reportData.email);
            formData.append('phone', this.reportData.phone);
            formData.append('description', this.reportData.description);
    
            if (this.reportData.image.file && this.reportData.image.file.length) {
                formData.append('image', this.reportData.image.file[0], this.reportData.image.file[0]['name']);
            }
    
            this.apiService.postFileData(constant.SAVE_REPORT_ISSUE, formData).subscribe((res: any) => {
                Swal.fire({
                    icon: res.status,
                    text: res.message,
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (res.code === 200) {
                        form.resetForm();
                    }
                });
                this.loader.setLoading(false);
                this.getDismissReason('submitted');
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
        } */

}
