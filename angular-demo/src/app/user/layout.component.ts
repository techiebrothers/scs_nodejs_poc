import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    collapedSideBar?: boolean;

    constructor(public authService: AuthService) {

    }

    ngOnInit() {}

    receiveCollapsed($event: any) {
        this.collapedSideBar = $event;
    }
}
