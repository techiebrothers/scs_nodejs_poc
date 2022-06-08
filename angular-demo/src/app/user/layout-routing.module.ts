import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthRoleGuard } from '../shared';
import { MenuResolve } from '../shared/services/menu.resolve';
import { ProfileModule } from './profile/profile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => DashboardModule, resolve: { menu: MenuResolve } },
            { path: 'profile', loadChildren: () => ProfileModule, resolve: { menu: MenuResolve } },
            { path: 'users', loadChildren: () => UsersModule, resolve: { menu: MenuResolve } },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
