import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTranslateModule } from '../../shared/modules/translate/translate.module';
import { Routes, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from '../../shared';


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
        SharedPipesModule
    ],
    exports: [
        HeaderComponent
    ],
    declarations: [HeaderComponent],
    providers: [AuthService],
})
export class HeaderModule {}
