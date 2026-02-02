package com.esprit.ms.projectmanagementbe.services;


import com.esprit.ms.projectmanagementbe.Enums.Status;
import com.esprit.ms.projectmanagementbe.entities.Project;
import com.esprit.ms.projectmanagementbe.entities.Task;
import com.esprit.ms.projectmanagementbe.exceptions.ResourceNotFoundException;
import com.esprit.ms.projectmanagementbe.repositories.ProjectRepository;
import com.esprit.ms.projectmanagementbe.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProject(Long projectId) {
        verifyProjectExists(projectId);
        return taskRepository.findByProjectId(projectId);
    }

    public Task createTask(Long projectId, Task task) {
        Project project = verifyProjectExists(projectId);
        task.setProject(project);
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setTitle(updatedTask.getTitle());
        task.setStatus(updatedTask.getStatus());
        task.setDueDate(updatedTask.getDueDate());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    public List<Task> getTasksByStatus(Status status) {
        return taskRepository.findByStatus(status);
    }

    private Project verifyProjectExists(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
    }

    public List<Task> getTasksByProjectAndStatus(Long projectId, Status status) {
        verifyProjectExists(projectId);
        return taskRepository.findByProjectIdAndStatus(projectId, status);
    }
}
