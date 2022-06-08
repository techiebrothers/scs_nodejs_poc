import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';
import { LayoutModule } from './user/layout.module';
import { LoginModule } from './user/login/login.module';
import { ForgotPasswordModule } from './user/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './user/reset-password/reset-password.module';
import { SignupModule } from './user/signup/signup.module';

const routes: Routes = [
    { path: '', loadChildren: () => LayoutModule, canActivate: [AuthGuard] },
    { path: 'login', loadChildren: () => LoginModule, canActivate: [AuthGuard] },
    { path: 'signup', loadChildren: () => SignupModule, canActivate: [AuthGuard] },
    { path: 'forgot-password', loadChildren: () => ForgotPasswordModule },
    { path: 'reset-password', loadChildren: () => ResetPasswordModule },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
