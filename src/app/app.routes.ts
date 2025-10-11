import { Routes } from '@angular/router';
import { DashboardComponent } from './feature/pages/dashboard/dashboard.component';
import { LoginComponent } from './feature/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardSuperusuarioComponent } from './feature/pages/dashboard-superusuario/dashboard-superusuario.component';
import { roleGuard } from './core/guards/role.guard';
import { RegisterComponent } from './feature/auth/register/register.component';
import { RegisterUserComponent } from './feature/auth/register-user/register-user.component';
import { RegisterRutineComponent } from './feature/pages/register-rutine/register-rutine.component';
import { RegisterExerciseComponent } from './feature/pages/register-exercise/register-exercise.component';
import { AboutUsComponent } from './feature/pages/about-us/about-us.component';
import { ContactComponent } from './feature/pages/contact/contact.component';
import { AsignarRutinaComponent } from './feature/pages/asignar-rutina/asignar-rutina.component';

export const routes: Routes = [

    {
        path: 'inicio-admin',
        component: DashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: {role: 'ROLE_Administrador'}
    },
    {
        path: 'iniciar-sesion',
        component: LoginComponent
    },
    {
        path: 'inicio-super',
        component: DashboardSuperusuarioComponent,
        canActivate: [authGuard, roleGuard],
        data: {role: 'ROLE_Superusuario'}
    },
    {
        path : 'register-admin',
        component: RegisterComponent,
        canActivate: [authGuard, roleGuard],
        data: {role: 'ROLE_Superusuario'}
    },
    {
        path : 'register-user',
        component: RegisterUserComponent,
        canActivate: [authGuard, roleGuard],
        data: {role: 'ROLE_Administrador'}
    },
    {
        path: 'register-rutine',
        canActivate: [authGuard],
        component: RegisterRutineComponent,
    },
    {
        path: 'register-exercise',
        canActivate: [authGuard],
        component: RegisterExerciseComponent
    },
    {
        path: 'sobre-nosotros',
        component: AboutUsComponent
    },
    {
        path: 'contacto',
        component: ContactComponent
    },
    {
        path: 'asignar-rutina/:id',
        canActivate: [authGuard],
        component: AsignarRutinaComponent
    },
    {path: '**', redirectTo: 'iniciar-sesion' },
];