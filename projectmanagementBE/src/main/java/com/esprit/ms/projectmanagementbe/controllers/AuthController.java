package com.esprit.ms.projectmanagementbe.controllers;

import com.esprit.ms.projectmanagementbe.dto.AuthResponse;
import com.esprit.ms.projectmanagementbe.dto.LoginRequest;
import com.esprit.ms.projectmanagementbe.dto.RegisterRequest;
import com.esprit.ms.projectmanagementbe.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Add this for testing only - REMOVE IN PRODUCTION
    @GetMapping("/test-login")
    public ResponseEntity<String> testLoginPage() {
        return ResponseEntity.ok("Login endpoint is POST only. Use POST to /api/auth/login with JSON body");
    }
}