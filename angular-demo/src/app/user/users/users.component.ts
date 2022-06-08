import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition, slideInOut } from '../../router.animations';
import { AuthService } from '../../shared/services/auth.service';
// import { ContentService } from '../../shared/services/employee.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { animate, state, style, transition, trigger, group } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../../shared/services/loader.service';
import Swal from 'sweetalert2';
import { ApiService } from '../../shared/services/api.service';
import { constant } from '../../constant';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SortbyService } from '../../shared/services/sortby.service';
import { RegexService } from '../../shared/services/regex.service';
import * as crypto from 'crypto-js';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ResetPasswordModalComponent } from '../../shared/components/reset-password-modal/reset-password-modal.component';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: [routerTransition(), slideInOut()]
})
export class UsersComponent implements OnInit {
    // userDetail = {};
    base_url = environment.pathUrl;
    emailPattern: RegExp;
    dataList: any = [];
    totalItems = 0;
    totalRecords = 0;
    searchValue = '';

    createOpened = false;
    dataItem: any = {
        id: '',
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location_id: '0',
        level_id: '0',
        password: '',
        confirmPassword: '',
        role: '',
        reset_request: '1',
        profile_picture: {}
    };

    constructor(public regexService: RegexService, public authService: AuthService, private translate: TranslateService, private toastr: ToastrService, private loader: LoaderService, public apiService: ApiService, private router: Router, public sortbyService: SortbyService, public resetPasswordModalComponent: ResetPasswordModalComponent, private modalService: NgbModal, public calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
        this.sortbyService.column = '(u.name*1=0), CAST(u.name as unsigned), u.name';
        this.sortbyService.direction = 'asc';
        this.emailPattern = regexService.pattern.emailPattern;

        if (this.authService.isLoggedIn()) {
            this.authService.getUserDetail().subscribe((success: any) => {
                this.getListInitial();
            },
                err => {
                    this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                        this.toastr.error(res1, '');
                        this.authService.logOut();
                    });
                });
        }
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.authService.advanceSearch = {
            match: 'exact',
            match_for: [],
            text: '',
            hoveredDate: '',
            created_date_from: '',
            created_date_to: '',
            updated_date_from: '',
            updated_date_to: '',
        };
    }

    getListInitial() {
        this.sortbyService.page = 1;
        this.getList();
    }
    getList() {
        this.loader.setLoading(true);
        const item = {
            page: this.sortbyService.page,
            limit: this.sortbyService.itemsPerPage,
            sort_column: this.sortbyService.column,
            sort_direction: this.sortbyService.direction,
        };
        this.apiService.postData(constant.GET_USERS, item).subscribe((success: any) => {
            this.dataList = success['data'];
            this.totalItems = success['totalItems'];
            this.totalRecords = success['totalRecords'];
            window.scrollTo(0, 0);
        });
    }
    pageChange(event: any) {
        this.sortbyService.page = event;
        this.getList();
    }
    deleteItem(id: any) {
        Swal.fire({
            // title: 'Are you sure?',
            text: "Are you sure you want to delete this ?",
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            denyButtonText: 'Soft Delete',
            denyButtonColor: '#000fff',
            confirmButtonText: 'Permanent Delete',
            confirmButtonColor: '#ff0000',
            cancelButtonColor: '#ff0000'
        }).then((result) => {
            if (result.isConfirmed || result.isDenied) {
                const is_hard = result.isConfirmed ? 1 : 0;
                this.apiService.deleteData(constant.DELETE_USERS, id + '/' + is_hard).subscribe((success: any) => {
                    /* this.translate.get((success['message']).toString()).subscribe((res1: string) => {
                        this.toastr.success(res1, '');
                    }); */
                    Swal.fire({
                        // title: 'Deleted',
                        text: success['message'],
                        icon: success['status'],
                    }).then((result) => {
                    });
                    if (this.dataList.length <= 1) {
                        this.sortbyService.page = this.sortbyService.page - 1;
                    }
                    this.getList();
                },
                    err => {
                        this.translate.get((err.error['message']).toString()).subscribe((res1: string) => {
                            // this.toastr.error(res1, '');
                            Swal.fire({
                                // title: 'Delete',
                                text: res1,
                                icon: 'error',
                            }).then((result) => {
                            });
                        });
                    });
            }
        })
    }
}
