import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
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
        LoginRoutingModule,
        FormsModule,
        NgbCarouselModule,
        NgbAlertModule,
        SharedTranslateModule,
        NgbModule,
        HeaderModule,
        FooterModule,
    ],
    declarations: [LoginComponent],
    providers: [AuthService],
})
export class LoginModule { }
