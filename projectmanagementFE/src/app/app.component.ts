import { Component, OnInit } from '@angular/core';
import { ProjectService } from './services/project.service';
import { TaskService } from './services/task.service';

// Declare Bootstrap for TypeScript
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selectedProject: any = null;
  selectedTask: any = null;
  isEditingProject = false;
  isEditingTask = false;
  projectCount = 0;
  taskCount = 0;
  activeTaskCount = 0;
  private editModal: any;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  // ============================================
  // PROJECT METHODS
  // ============================================
  
  onSelectProject(project: any) {
    console.log('Selected project:', project);  
    this.selectedProject = project;
    this.isEditingProject = true;
    this.openModal();
  }
  openModal() {
    const modalElement = document.getElementById('editProjectModal');
    if (modalElement) {
      this.editModal = new bootstrap.Modal(modalElement);
      this.editModal.show();
    }
  }

  closeModal() {
    if (this.editModal) {
      this.editModal.hide();
    }
    this.selectedProject = null;
    this.isEditingProject = false;
  }

  onProjectSaved(project: any) {
    this.closeModal();
    this.loadStatistics();
    window.location.hash = '#projects'; // Small trick to trigger refresh
    setTimeout(() => window.location.reload(), 100);
    // The project list component should refresh automatically
  }

  onDeleteProject(projectId: number) {
    this.selectedProject = null;
    this.isEditingProject = false;
    this.loadStatistics();
  }

  onCancelEdit() {
    this.closeModal();
  }

  // ============================================
  // TASK METHODS
  // ============================================

  onSelectTask(task: any) {
    this.selectedTask = task;
    this.isEditingTask = true;
    this.scrollTo('tasks');
  }

  onTaskSaved(task: any) {
    this.selectedTask = null;
    this.isEditingTask = false;
    this.loadStatistics();
  }

  onDeleteTask(taskId: number) {
    this.selectedTask = null;
    this.isEditingTask = false;
    this.loadStatistics();
  }

  onCancelTaskEdit() {
    this.selectedTask = null;
    this.isEditingTask = false;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  clearSelection() {
    this.selectedProject = null;
    this.selectedTask = null;
    this.isEditingProject = false;
    this.isEditingTask = false;
  }

  loadStatistics() {
    // Load project count
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projectCount = projects.length;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });

    // Load task count
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.taskCount = tasks.length;
        this.activeTaskCount = tasks.filter((task: any) => 
          task.status !== 'DONE' && task.status !== 'COMPLETED'
        ).length;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}