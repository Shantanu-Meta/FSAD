package com.bits.fsad.service;

import com.bits.fsad.entity.*;
import com.bits.fsad.exception.BusinessException;
import com.bits.fsad.exception.ResourceNotFoundException;
import com.bits.fsad.repository.AdmissionRepository;
import com.bits.fsad.repository.ApplicationRepository;
import com.bits.fsad.repository.CourseRepository;
import com.bits.fsad.security.CurrentUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final AdmissionRepository admissionRepository;
    private final CourseRepository courseRepository;
    private final CurrentUser currentUser;

    public ApplicationService(ApplicationRepository applicationRepository,
                              AdmissionRepository admissionRepository,
                              CourseRepository courseRepository,
                              CurrentUser currentUser) {
        this.applicationRepository = applicationRepository;
        this.admissionRepository = admissionRepository;
        this.courseRepository = courseRepository;
        this.currentUser = currentUser;
    }

    public List<Application> findAll() {
        return applicationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Application> findByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Application findById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + id));
    }

    /** Clerk enters a new application; always starts PENDING. */
    @Transactional
    public Application create(Application app) {
        Course course = courseRepository.findById(app.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + app.getCourseId()));
        if (!Boolean.TRUE.equals(course.getIsActive())) {
            throw new BusinessException("Course is not active: " + course.getCourseCode());
        }
        app.setStatus(ApplicationStatus.PENDING);
        app.setEnteredBy(currentUser.getId());
        app.setReviewedBy(null);
        app.setReviewedAt(null);
        return applicationRepository.save(app);
    }

    /**
     * Admin approves a PENDING application. Irreversible. On approval an
     * Admission record is auto-created with a generated roll number and a seat
     * is decremented.
     */
    @Transactional
    public Admission approve(Long applicationId, String remarks) {
        Application app = findById(applicationId);
        ensurePending(app);

        Course course = courseRepository.findById(app.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + app.getCourseId()));
        if (course.getAvailableSeats() <= 0) {
            throw new BusinessException("No seats available for course " + course.getCourseCode());
        }

        app.setStatus(ApplicationStatus.APPROVED);
        app.setReviewedBy(currentUser.getId());
        app.setReviewedAt(LocalDateTime.now());
        app.setRemarks(remarks);
        applicationRepository.save(app);

        // Decrement a seat.
        course.setAvailableSeats(course.getAvailableSeats() - 1);
        courseRepository.save(course);

        // Build admission with auto roll number.
        String academicYear = currentAcademicYear();
        int year = LocalDate.now().getYear();
        String rollNumber = generateRollNumber(course, year);

        Admission admission = new Admission();
        admission.setApplicationId(app.getApplicationId());
        admission.setCourseId(course.getCourseId());
        admission.setAdmissionDate(LocalDate.now());
        admission.setAcademicYear(academicYear);
        admission.setRollNumber(rollNumber);
        admission.setStatus("ADMITTED");
        admission.setAdmittedBy(currentUser.getId());
        return admissionRepository.save(admission);
    }

    /** Admin rejects a PENDING application with remarks. Irreversible. */
    @Transactional
    public Application reject(Long applicationId, String remarks) {
        Application app = findById(applicationId);
        ensurePending(app);
        app.setStatus(ApplicationStatus.REJECTED);
        app.setReviewedBy(currentUser.getId());
        app.setReviewedAt(LocalDateTime.now());
        app.setRemarks(remarks);
        return applicationRepository.save(app);
    }

    private void ensurePending(Application app) {
        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new BusinessException(
                    "Application is already " + app.getStatus() + " — status changes are irreversible");
        }
    }

    /** Format: COURSE_CODE-YEAR-SEQ, sequence per-course per-year, zero-padded to 3. */
    private String generateRollNumber(Course course, int year) {
        long existing = admissionRepository.countByCourseIdAndAcademicYear(
                course.getCourseId(), currentAcademicYear());
        long seq = existing + 1;
        return String.format("%s-%d-%03d", course.getCourseCode(), year, seq);
    }

    private String currentAcademicYear() {
        int year = LocalDate.now().getYear();
        int nextTwo = (year + 1) % 100;
        return String.format("%d-%02d", year, nextTwo);
    }
}
