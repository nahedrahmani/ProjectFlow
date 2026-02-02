package com.esprit.ms.projectmanagementbe.repositories;

import com.esprit.ms.projectmanagementbe.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
