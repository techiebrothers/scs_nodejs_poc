import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedPipesModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTranslateModule } from '../../shared/modules/translate/translate.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
    imports: [
        CommonModule,
        // NgbCarouselModule.forRoot(),
        // NgbAlertModule.forRoot(),
        FormsModule,
        SharedTranslateModule,
        DashboardRoutingModule,
        SharedPipesModule,
        NgbModule,
        NgxPaginationModule,
        NgMultiSelectDropDownModule,
        NgbDropdownModule,
        DragDropModule
    ],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule { }
