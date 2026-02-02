import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService, Project } from '../services/project.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit, OnChanges {
  @Input() project: Project | null = null;
  @Output() projectSaved = new EventEmitter<Project>();
  @Output() cancelEdit = new EventEmitter<void>();

  projectForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadProjectData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      this.loadProjectData();
    }
  }

  // ✅ NEW HELPER METHOD
  loadProjectData() {
    if (this.project) {
      this.isEditMode = true;
      this.projectForm.patchValue({
        name: this.project.name,
        description: this.project.description || ''
      });
    } else {
      this.isEditMode = false;
      this.projectForm.reset({
        name: '',
        description: ''
      });
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.markFormTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const projectData: Project = this.projectForm.value;

    if (this.isEditMode && this.project?.id) {
      this.projectService.updateProject(this.project.id, projectData).subscribe({
        next: (response) => {
          this.handleSuccess('Project updated successfully!', response);
        },
        error: (error) => {
          this.handleError('Failed to update project. Please try again.');
        }
      });
    } else {
      this.projectService.createProject(projectData).subscribe({
        next: (response) => {
          this.handleSuccess('Project created successfully!', response);
        },
        error: (error) => {
          this.handleError('Failed to create project. Please try again.');
        }
      });
    }
  }

  handleSuccess(message: string, project: Project) {
    this.successMessage = message;
    this.isLoading = false;
    setTimeout(() => {
      this.projectSaved.emit(project);
      this.resetForm();
    }, 1500);
  }

  handleError(message: string) {
    this.errorMessage = message;
    this.isLoading = false;
  }

  markFormTouched() {
    Object.values(this.projectForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel() {
    this.resetForm();
    this.cancelEdit.emit();
  }

  resetForm() {
    this.projectForm.reset({
      name: '',
      description: ''
    });
    this.isEditMode = false;
    this.project = null;
    this.successMessage = '';
    this.errorMessage = '';
  }
}