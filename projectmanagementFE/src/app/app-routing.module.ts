import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'create-project', component: ProjectFormComponent },
  { path: 'edit-project/:id', component: ProjectFormComponent },
  { path: 'tasks/:projectId', component: TaskListComponent },
  { path: 'tasks/:projectId/create', component: TaskFormComponent },
  { path: 'tasks/:projectId/edit/:taskId', component: TaskFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
