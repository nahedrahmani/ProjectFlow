import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Input() projectId: number | undefined;
  @Output() selectTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = false;
  isDeleting = false;
  isDeletingId: number | null = null;
  errorMessage = '';
  filterStatus: string = 'ALL';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.projectId) {
      // Load tasks for specific project
      this.taskService.getTasksByProject(this.projectId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasks = tasks;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load tasks. Please try again.';
          this.isLoading = false;
          console.error('Error loading tasks:', error);
        }
      });
    } else {
      // Load all tasks
      this.taskService.getAllTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasks = tasks;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load tasks. Please try again.';
          this.isLoading = false;
          console.error('Error loading tasks:', error);
        }
      });
    }
  }

  onFilterChange(status: string) {
    this.filterStatus = status;
    if (status === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === status);
    }
  }

  onSelectTask(task: Task) {
    this.selectTask.emit(task);
  }

  onDeleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.isDeleting = true;
      this.isDeletingId = taskId;
      
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
          this.tasks = this.tasks.filter(t => t.id !== taskId);
          this.filteredTasks = this.filteredTasks.filter(t => t.id !== taskId);
          this.deleteTask.emit(taskId);
          this.isDeleting = false;
          this.isDeletingId = null;
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete task. Please try again.';
          this.isDeleting = false;
          this.isDeletingId = null;
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO': return 'badge bg-secondary';
      case 'IN_PROGRESS': return 'badge bg-warning text-dark';
      case 'DONE': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isOverdue(dueDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }
}