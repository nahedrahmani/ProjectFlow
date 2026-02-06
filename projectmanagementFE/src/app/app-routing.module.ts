import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: 'create-project', component: ProjectFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-project/:id', component: ProjectFormComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:projectId', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:projectId/create', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:projectId/edit/:taskId', component: TaskFormComponent, canActivate: [AuthGuard] },
  { 
    path: '', 
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
