import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectService, Project } from '../services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @Output() selectProject = new EventEmitter<Project>();
  @Output() editProject = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<number>();

  projects: Project[] = [];
  isLoading = false;
  isDeleting = false;
  isDeletingId: number | null = null;
  errorMessage = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load projects. Please try again.';
        this.isLoading = false;
        console.error('Error loading projects:', error);
      }
    });
  }

  // Eye button - Just selects project for viewing tasks
  onShowProject(project: Project) {
    this.selectProject.emit(project);
  }

  // Pencil button - Opens edit modal
  onEditProject(project: Project) {
    this.editProject.emit(project);
  }

  onDeleteProject(projectId: number) {
    if (confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
      this.isDeleting = true;
      this.isDeletingId = projectId;
      
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== projectId);
          this.deleteProject.emit(projectId);
          this.isDeleting = false;
          this.isDeletingId = null;
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete project. Please try again.';
          this.isDeleting = false;
          this.isDeletingId = null;
          console.error('Error deleting project:', error);
        }
      });
    }
  }
}