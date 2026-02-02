📋 ProjectFlow – Project Management System

A full-stack project management application built with Angular and Spring Boot for creating projects, managing tasks, and tracking progress efficiently.

🌟 Features

Project Management

Create, edit, delete, and view projects

Track tasks per project

Task Management

Create tasks and assign to projects

Update task status (TODO, IN_PROGRESS, DONE)

Set due dates with validation

Filter tasks by project and/or status

Overdue task indicators

Extras

Cascade delete: removing a project deletes its tasks

Responsive, modern UI with Bootstrap

RESTful API architecture

🛠️ Tech Stack

Backend: Java 17, Spring Boot 3.x, Spring Data JPA, H2/PostgreSQL, Maven

Frontend: Angular 17, TypeScript, Bootstrap 5, Boxicons, RxJS

🚀 Quick Start
Backend
cd projectmanagementBE
mvn clean install
mvn spring-boot:run


Default URL: http://localhost:8099

Frontend
cd projectmanagementFE
npm install
ng serve


Open browser: http://localhost:4200

📁 Project Structure
ProjectFlow/
├─ projectmanagementBE/  # Spring Boot backend
└─ projectmanagementFE/  # Angular frontend



📝 License

MIT License
