package com.esprit.ms.projectmanagementbe.controllers;

import com.esprit.ms.projectmanagementbe.Enums.Status;
import com.esprit.ms.projectmanagementbe.entities.Task;
import com.esprit.ms.projectmanagementbe.services.TaskService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    public List<Task> getAllTasks(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Long projectId) {

        // Filter by both status and project
        if (status != null && projectId != null) {
            return taskService.getTasksByProjectAndStatus(projectId, status);
        }

        // Filter by status only
        if (status != null) {
            return taskService.getTasksByStatus(status);
        }

        // Filter by project only
        if (projectId != null) {
            return taskService.getTasksByProject(projectId);
        }

        // No filters - return all
        return taskService.getAllTasks();
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProject(projectId);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public Task createTask(@PathVariable Long projectId, @Valid @RequestBody Task task) {
        return taskService.createTask(projectId, task);
    }

    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
