import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { routerTransition, slideInOut } from '../../router.animations';
import { ApiService } from '../../shared/services/api.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { RegexService } from '../../shared/services/regex.service';
import { constant } from '../../constant';
import { LoaderService } from '../../shared/services/loader.service';
import { NgForm } from '@angular/forms';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { NgbPanelChangeEvent, NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    base_url = environment.pathUrl;
    isLoading: any = false;
    emailPattern: RegExp;
    userDetail: any = { password: '', confirmPassword: '', first_name: '', last_name: '', email: '' };
    accept_file: any = {
        image: [".png", ".jpeg", ".jpg"]
    }
    allowMaxFileSize = 1024000;
    imageSrc: any;

    imageChangedEvent: any = '';
    croppedImage: any = '';
    croppedImageBlob: any;

    constructor(public authService: AuthService, private translate: TranslateService, private toastr: ToastrService, public regexService: RegexService, private loader: LoaderService, public apiService: ApiService, public ref: ChangeDetectorRef, private modalService: NgbModal, public router: Router) {
        this.emailPattern = regexService.pattern.emailPattern;
    }

    ngOnInit() {
    }
    clearForm() {
        this.userDetail = { password: '', confirmPassword: '', first_name: '', last_name: '', email: '' };
    }
    /* Start create content code */
    async fileChangeEvent(fileInput: any, content: any) {
        this.imageChangedEvent = fileInput;

        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true }).result.then((result) => {
            // this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    removeFile() {
        this.userDetail.profile_picture = {};
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.croppedImageBlob = base64ToFile(this.croppedImage);
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }
    saveCroppedImage() {
        /* let item: Object = {
            file: this.croppedImage,
            file_name: this.imageChangedEvent.target.files[0].name,
            file_src: this.croppedImage,
        };
        this.userDetail.profile_picture = item; */

        const file = this.croppedImageBlob;
        const reader = new FileReader();
        reader.onload = e => {
            let item: Object = {
                file: [file],
                file_name: this.imageChangedEvent.target.files[0].name,
                file_src: this.croppedImage,
            };
            this.userDetail.profile_picture = item;
            console.log('this.userDetail.profile_picture', this.userDetail.profile_picture);
        }
        reader.readAsDataURL(file);
    }

    onRegister() {
        console.log('onSave', this.userDetail);


        const data = JSON.parse(JSON.stringify(this.userDetail));
        data.password = crypto.AES.encrypt(data.password, environment.encryptionKey).toString();

        this.loader.setLoading(true);
        const formData = new FormData();

        formData.append('first_name', this.userDetail.first_name);
        formData.append('last_name', this.userDetail.last_name);
        formData.append('email', this.userDetail.email);
        formData.append('password', data.password);

        this.apiService.postFileData(constant.SAVE_USERS, formData).subscribe((res: any) => {
            // this.ref.detach();
            // setInterval(() => { this.ref.detectChanges(); }, 5000);
            this.loader.setLoading(false);

            Swal.fire({
                icon: res.status,
                text: res.message,
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                this.router.navigate(['login']);
            });
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
            }
        );
        return true;
    }
}
