import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition, slideInOut } from '../../router.animations';
import { AuthService } from '../../shared/services/auth.service';
// import { ContentService } from '../../shared/services/employee.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { animate, state, style, transition, trigger, group } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../../shared/services/loader.service';
import Swal from 'sweetalert2';
import { ApiService } from '../../shared/services/api.service';
import { constant } from '../../constant';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SortbyService } from '../../shared/services/sortby.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition(), slideInOut()]
})
export class DashboardComponent implements OnInit {
    // userDetail = {};
    base_url = environment.pathUrl;
    menuList: any = {
        'user': [
            { title: 'Users', name: '', url: '/users', colorClass: 'info' },
        ]
    };

    constructor(public authService: AuthService, private translate: TranslateService, private toastr: ToastrService, private loader: LoaderService, public apiService: ApiService, private router: Router, public sortbyService: SortbyService, private modalService: NgbModal) {
        this.sortbyService.column = 'r.title_eng';
        this.sortbyService.direction = 'asc';
        if (this.authService.isLoggedIn()) {
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

    ngOnInit() { }

    ngOnDestroy() {
    }

    saveDashboardFilter(item: any) {
        localStorage.setItem('dashboardFilter', item.name);
        this.router.navigate([item.url]);
    }
}
