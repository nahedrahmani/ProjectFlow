import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

export interface Task {
  id?: number;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
  project?: any;
}

export interface Project {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
  tasks?: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8099/api/projects';

  constructor(
    private http: HttpClient, 
    private tokenStorage: TokenStorageService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();
    console.log('🔑 Token in ProjectService:', token ? 'EXISTS' : 'MISSING');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getProjects(): Observable<Project[]> {
    console.log('📡 Fetching projects...');
    return this.http.get<Project[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project, { headers: this.getHeaders() });
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project, { headers: this.getHeaders() });
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${projectId}/tasks`, { headers: this.getHeaders() });
  }

  createTask(projectId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks`, task, { headers: this.getHeaders() });
  }

  updateTask(taskId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`http://localhost:8099/api/tasks/${taskId}`, task, { headers: this.getHeaders() });
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8099/api/tasks/${taskId}`, { headers: this.getHeaders() });
  }
}