package com.esprit.ms.projectmanagementbe.repositories;

import com.esprit.ms.projectmanagementbe.Enums.Status;
import com.esprit.ms.projectmanagementbe.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find all tasks for a given project
    List<Task> findByProjectId(Long projectId);

    // Find all tasks with a specific status
    List<Task> findByStatus(Status status);

    List<Task> findByProjectIdAndStatus(Long projectId, Status status);

}
