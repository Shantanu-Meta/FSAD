package com.bits.fsad.controller;

import com.bits.fsad.dto.ReviewRequest;
import com.bits.fsad.entity.Admission;
import com.bits.fsad.entity.Application;
import com.bits.fsad.entity.ApplicationStatus;
import com.bits.fsad.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /** List applications, optionally filtered by status (Admin view). */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Application> list(@RequestParam(required = false) ApplicationStatus status) {
        return (status == null) ? applicationService.findAll() : applicationService.findByStatus(status);
    }

    @GetMapping("/{id}")
    public Application get(@PathVariable Long id) {
        return applicationService.findById(id);
    }

    /** Clerk enters a new application. */
    @PostMapping
    @PreAuthorize("hasRole('CLERK')")
    public ResponseEntity<Application> create(@Valid @RequestBody Application application) {
        return ResponseEntity.ok(applicationService.create(application));
    }

    /** Admin approves — auto-creates admission with roll number. Irreversible. */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Admission approve(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        String remarks = (req != null) ? req.getRemarks() : null;
        return applicationService.approve(id, remarks);
    }

    /** Admin rejects with remarks. Irreversible. */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public Application reject(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        String remarks = (req != null) ? req.getRemarks() : null;
        return applicationService.reject(id, remarks);
    }
}
