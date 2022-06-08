import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedPipesModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTranslateModule } from '../../shared/modules/translate/translate.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ResetPasswordModalModule } from './../../shared/components/reset-password-modal/reset-password-modal.module';
import { ResetPasswordModalComponent } from './../../shared/components/reset-password-modal/reset-password-modal.component';
import { AuthService } from '../../shared/services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        // NgbCarouselModule.forRoot(),
        // NgbAlertModule.forRoot(),
        FormsModule,
        SharedTranslateModule,
        UsersRoutingModule,
        SharedPipesModule,
        NgbModule,
        NgxPaginationModule,
        NgbDropdownModule,
        NgMultiSelectDropDownModule.forRoot(),
        ResetPasswordModalModule
    ],
    declarations: [
        UsersComponent,
    ],
    providers: [AuthService, ResetPasswordModalComponent],
})
export class UsersModule { }
