import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { LogInGuard } from '../../core/guards/log-in.guard';

const routes: Routes = [
    {
        canActivate: [LogInGuard],
        path: '', component: LoginComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
