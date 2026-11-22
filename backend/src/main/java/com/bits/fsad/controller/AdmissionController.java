package com.bits.fsad.controller;

import com.bits.fsad.entity.Admission;
import com.bits.fsad.service.AdmissionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    private final AdmissionService admissionService;

    public AdmissionController(AdmissionService admissionService) {
        this.admissionService = admissionService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','CLERK')")
    public List<Admission> list() {
        return admissionService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CLERK')")
    public Admission get(@PathVariable Long id) {
        return admissionService.findById(id);
    }

    /** Clerk searches by roll number during fee collection. */
    @GetMapping("/roll/{rollNumber}")
    @PreAuthorize("hasAnyRole('ADMIN','CLERK')")
    public Admission byRoll(@PathVariable String rollNumber) {
        return admissionService.findByRollNumber(rollNumber);
    }
}
