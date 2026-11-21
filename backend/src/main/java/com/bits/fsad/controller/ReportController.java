package com.bits.fsad.controller;

import com.bits.fsad.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return reportService.summary();
    }

    @GetMapping("/seats")
    public List<Map<String, Object>> seats() {
        return reportService.seatAvailability();
    }

    @GetMapping("/admissions")
    public List<Map<String, Object>> admissions() {
        return reportService.admissionsByCourse();
    }

    @GetMapping("/fees")
    public Map<String, Object> fees() {
        return reportService.feeCollection();
    }
}
