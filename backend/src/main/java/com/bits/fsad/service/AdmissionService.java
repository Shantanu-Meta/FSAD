package com.bits.fsad.service;

import com.bits.fsad.entity.Admission;
import com.bits.fsad.exception.ResourceNotFoundException;
import com.bits.fsad.repository.AdmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdmissionService {

    private final AdmissionRepository admissionRepository;

    public AdmissionService(AdmissionRepository admissionRepository) {
        this.admissionRepository = admissionRepository;
    }

    public List<Admission> findAll() {
        return admissionRepository.findAllByOrderByAdmissionDateDesc();
    }

    public Admission findById(Long id) {
        return admissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission not found: " + id));
    }

    public Admission findByRollNumber(String rollNumber) {
        return admissionRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResourceNotFoundException("No admission for roll number: " + rollNumber));
    }
}
