package com.esprit.ms.projectmanagementbe.services;

import com.esprit.ms.projectmanagementbe.entities.Project;
import com.esprit.ms.projectmanagementbe.entities.User;
import com.esprit.ms.projectmanagementbe.exceptions.ResourceNotFoundException;
import com.esprit.ms.projectmanagementbe.repositories.ProjectRepository;
import com.esprit.ms.projectmanagementbe.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;


    public ProjectService(ProjectRepository projectRepository , UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<Project> getAllProjects() {
        User currentUser = getCurrentUser();
        return projectRepository.findByUserId(currentUser.getId());
    }

    public Project getProjectById(Long id) {
        User currentUser = getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        // Verify the project belongs to the current user
        if (!project.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }

        return project;
    }

    public Project createProject(Project project) {
        User currentUser = getCurrentUser();
        project.setUser(currentUser);
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {
        User currentUser = getCurrentUser();
        Project project = getProjectById(id);
        project.setName(updatedProject.getName());
        project.setDescription(updatedProject.getDescription());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project); // cascade deletes tasks automatically
    }
}
