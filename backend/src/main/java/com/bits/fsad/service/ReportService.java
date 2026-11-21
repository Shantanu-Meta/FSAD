package com.bits.fsad.service;

import com.bits.fsad.entity.*;
import com.bits.fsad.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CourseRepository courseRepository;
    private final ApplicationRepository applicationRepository;
    private final AdmissionRepository admissionRepository;
    private final PaymentRepository paymentRepository;

    public ReportService(CourseRepository courseRepository,
                         ApplicationRepository applicationRepository,
                         AdmissionRepository admissionRepository,
                         PaymentRepository paymentRepository) {
        this.courseRepository = courseRepository;
        this.applicationRepository = applicationRepository;
        this.admissionRepository = admissionRepository;
        this.paymentRepository = paymentRepository;
    }

    /** Seat availability per course (total, available, filled). */
    public List<Map<String, Object>> seatAvailability() {
        List<Map<String, Object>> rows = new ArrayList<>();
        for (Course c : courseRepository.findAll()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("courseId", c.getCourseId());
            row.put("courseCode", c.getCourseCode());
            row.put("courseName", c.getCourseName());
            row.put("totalSeats", c.getTotalSeats());
            row.put("availableSeats", c.getAvailableSeats());
            row.put("filledSeats", c.getTotalSeats() - c.getAvailableSeats());
            rows.add(row);
        }
        return rows;
    }

    /** Admission count per course. */
    public List<Map<String, Object>> admissionsByCourse() {
        List<Map<String, Object>> rows = new ArrayList<>();
        for (Course c : courseRepository.findAll()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("courseCode", c.getCourseCode());
            row.put("courseName", c.getCourseName());
            row.put("admissions", admissionRepository.countByCourseId(c.getCourseId()));
            row.put("applications", applicationRepository.countByCourseId(c.getCourseId()));
            rows.add(row);
        }
        return rows;
    }

    /** Overall dashboard summary counts. */
    public Map<String, Object> summary() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalApplications", applicationRepository.count());
        m.put("pending", applicationRepository.countByStatus(ApplicationStatus.PENDING));
        m.put("approved", applicationRepository.countByStatus(ApplicationStatus.APPROVED));
        m.put("rejected", applicationRepository.countByStatus(ApplicationStatus.REJECTED));
        m.put("totalAdmissions", admissionRepository.count());
        int totalSeats = 0, available = 0;
        for (Course c : courseRepository.findAll()) {
            totalSeats += c.getTotalSeats();
            available += c.getAvailableSeats();
        }
        m.put("totalSeats", totalSeats);
        m.put("availableSeats", available);
        m.put("totalCourses", courseRepository.count());
        m.put("feeCollected", totalFeeCollected());
        return m;
    }

    /** Fee collection summary grouped by payment mode plus grand total. */
    public Map<String, Object> feeCollection() {
        Map<String, BigDecimal> byMode = new LinkedHashMap<>();
        for (PaymentMode mode : PaymentMode.values()) {
            byMode.put(mode.name(), BigDecimal.ZERO);
        }
        BigDecimal grand = BigDecimal.ZERO;
        for (Payment p : paymentRepository.findAll()) {
            String mode = p.getPaymentMode().name();
            byMode.put(mode, byMode.get(mode).add(p.getAmountPaid()));
            grand = grand.add(p.getAmountPaid());
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("byMode", byMode);
        result.put("grandTotal", grand);
        result.put("transactionCount", paymentRepository.count());
        return result;
    }

    private BigDecimal totalFeeCollected() {
        BigDecimal grand = BigDecimal.ZERO;
        for (Payment p : paymentRepository.findAll()) {
            grand = grand.add(p.getAmountPaid());
        }
        return grand;
    }
}
