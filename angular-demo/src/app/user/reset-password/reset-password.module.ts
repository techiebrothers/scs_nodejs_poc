import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';

import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTranslateModule } from '../../shared/modules/translate/translate.module';

@NgModule({
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        FormsModule,
        NgbCarouselModule,
        NgbAlertModule,
        SharedTranslateModule,
    ],
    declarations: [ResetPasswordComponent],
    providers: [AuthService],
})
export class ResetPasswordModule { }
