import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { SharedTranslateModule } from '../../shared/modules/translate/translate.module';
import { PageHeaderModule } from '../../shared';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule,
        SharedTranslateModule,
        NgbAlertModule,
        PageHeaderModule,
        ImageCropperModule
    ],
    declarations: [ProfileComponent],
    providers: [AuthService],
})
export class ProfileModule {}
