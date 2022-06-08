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

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    animations: [routerTransition()]
})
export class ProfileComponent implements OnInit {
    base_url = environment.pathUrl;
    emailPattern: RegExp;
    userDetail: any = { id: '', name: '', first_name: '', last_name: '', email: '', access: [], access_ids: '', access_role: [], profile_picture: { file_src: '' }, level_id: 0 };
    accept_file: any = {
        image: [".png", ".jpeg", ".jpg"]
    }
    allowMaxFileSize = 1024000;
    imageSrc: any;
    locationList: any = [];

    imageChangedEvent: any = '';
    croppedImage: any = '';
    croppedImageBlob: any;

    constructor(public authService: AuthService, private translate: TranslateService, private toastr: ToastrService, public regexService: RegexService, private loader: LoaderService, public apiService: ApiService, public ref: ChangeDetectorRef, private modalService: NgbModal) {
        this.emailPattern = regexService.pattern.emailPattern;
        this.getUserDetails();
    }

    ngOnInit() {
    }

    getUserDetails() {
        this.authService.getUserDetail().subscribe((success: any) => {
            this.userDetail = success.data.userDetails;
            console.log('this.userDetail', this.userDetail);
            if (!this.userDetail.profile_picture.file_name) {
                let item1: Object = {
                    file: '',
                    file_name: this.userDetail.profile_picture,
                    file_src: this.base_url + 'upload/profile/' + this.userDetail.profile_picture,
                };
                this.userDetail.profile_picture = item1;
            }
            // this.userDetail = authService.userDetail;
        },
            err => {
                this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                    this.toastr.error(res1, '');
                    this.authService.logOut();
                });
            });
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

    saveItem(form: NgForm) {
        console.log('onSave', this.userDetail);

        this.loader.setLoading(true);
        const formData = new FormData();

        formData.append('id', this.userDetail.id);
        formData.append('name', this.userDetail.name);
        formData.append('first_name', this.userDetail.first_name);
        formData.append('last_name', this.userDetail.last_name);
        formData.append('email', this.userDetail.email);
        formData.append('phone', this.userDetail.phone);
        formData.append('role', this.userDetail.role);
        formData.append('from_profile', '1');
        formData.append('reset_request', '0');


        formData.append('status', 'active');

        if (this.userDetail.profile_picture.file && this.userDetail.profile_picture.file.length) {
            formData.append('profile_picture', this.userDetail.profile_picture.file[0], this.userDetail.profile_picture.file_name);
        }

        this.apiService.postFileData(constant.SAVE_USERS, formData).subscribe((res: any) => {
            this.authService.userDetail.profile_picture = '';
            this.getUserDetails();
            this.ref.detach();
            setInterval(() => { this.ref.detectChanges(); }, 5000);

            Swal.fire({
                icon: res.status,
                text: res.message,
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
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
    cancelProfileEdit() {
        window.history.back();
    }
}
