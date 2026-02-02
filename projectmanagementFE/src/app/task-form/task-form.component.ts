import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Input() projectId: number | undefined;
  @Output() taskSaved = new EventEmitter<Task>();
  @Output() cancelEdit = new EventEmitter<void>();

  taskForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['TODO', [Validators.required]],
      dueDate: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadTaskData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] || changes['projectId']) {
      this.loadTaskData();
    }
  }

  // ✅ NEW HELPER METHOD
  loadTaskData() {
    if (this.task) {
      this.isEditMode = true;
      const dueDate = this.task.dueDate ? 
        new Date(this.task.dueDate).toISOString().split('T')[0] : '';
      
      this.taskForm.patchValue({
        title: this.task.title,
        status: this.task.status,
        dueDate: dueDate
      });
    } else {
      this.isEditMode = false;
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.taskForm.patchValue({
        title: '',
        status: 'TODO',
        dueDate: tomorrow.toISOString().split('T')[0]
      });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid || !this.projectId) {
      this.markFormTouched();
      if (!this.projectId) {
        this.errorMessage = 'Please select a project first';
      }
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const taskData: Task = {
      ...this.taskForm.value,
      dueDate: new Date(this.taskForm.value.dueDate).toISOString()
    };

    if (this.isEditMode && this.task?.id) {
      this.taskService.updateTask(this.task.id, taskData).subscribe({
        next: (response) => {
          this.handleSuccess('Task updated successfully!', response);
        },
        error: (error) => {
          this.handleError('Failed to update task. Please try again.');
        }
      });
    } else {
      this.taskService.createTask(this.projectId!, taskData).subscribe({
        next: (response) => {
          this.handleSuccess('Task created successfully!', response);
        },
        error: (error) => {
          this.handleError('Failed to create task. Please try again.');
        }
      });
    }
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  handleSuccess(message: string, task: Task) {
    this.successMessage = message;
    this.isLoading = false;
    setTimeout(() => {
      this.taskSaved.emit(task);
      this.resetForm();
    }, 1500);
  }

  handleError(message: string) {
    this.errorMessage = message;
    this.isLoading = false;
  }

  markFormTouched() {
    Object.values(this.taskForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel() {
    this.resetForm();
    this.cancelEdit.emit();
  }

  resetForm() {
    this.taskForm.reset({
      title: '',
      status: 'TODO',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
    });
    this.isEditMode = false;
    this.task = null;
    this.successMessage = '';
    this.errorMessage = '';
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
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }
}