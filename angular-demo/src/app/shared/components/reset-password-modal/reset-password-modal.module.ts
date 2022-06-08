import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordModalComponent } from './reset-password-modal.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTranslateModule } from '../../modules/translate/translate.module';
import { Routes, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalDraggableModule } from 'ngb-modal-draggable';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbCarouselModule,
        NgbAlertModule,
        SharedTranslateModule,
        RouterModule,
        NgbModule,
        NgbDropdownModule,
        NgbModalDraggableModule
    ],
    exports: [
        ResetPasswordModalComponent
    ],
    declarations: [ResetPasswordModalComponent],
    providers: [AuthService, NgbActiveModal],
})
export class ResetPasswordModalModule { }
