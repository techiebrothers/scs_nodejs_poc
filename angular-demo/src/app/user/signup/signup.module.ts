import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTranslateModule } from '../../shared/modules/translate/translate.module';
import { HeaderModule } from './../header/header.module';
import { FooterModule } from './../footer/footer.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        SignupRoutingModule,
        FormsModule,
        NgbCarouselModule,
        NgbAlertModule,
        SharedTranslateModule,
        NgbModule,
        HeaderModule,
        FooterModule,
    ],
    declarations: [SignupComponent],
    providers: [AuthService],
})
export class SignupModule { }
