package com.bits.fsad.controller;

import com.bits.fsad.entity.Admission;
import com.bits.fsad.service.AdmissionService;
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
    public List<Admission> list() {
        return admissionService.findAll();
    }

    @GetMapping("/{id}")
    public Admission get(@PathVariable Long id) {
        return admissionService.findById(id);
    }

    /** Clerk searches by roll number during fee collection. */
    @GetMapping("/roll/{rollNumber}")
    public Admission byRoll(@PathVariable String rollNumber) {
        return admissionService.findByRollNumber(rollNumber);
    }
}
