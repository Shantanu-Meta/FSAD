package com.bits.fsad.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "admissions", indexes = {
        @Index(name = "idx_adm_year", columnList = "academic_year"),
        @Index(name = "idx_adm_course", columnList = "course_id")
})
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admission_id")
    private Long admissionId;

    @Column(name = "application_id", nullable = false, unique = true)
    private Long applicationId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "roll_number", nullable = false, unique = true, length = 30)
    private String rollNumber; // Auto-generated: BCA-2024-001

    @Column(nullable = false, length = 15)
    private String status = "ADMITTED";

    @Column(name = "admitted_by", nullable = false)
    private Long admittedBy;

    @PrePersist
    void onCreate() {
        if (admissionDate == null) admissionDate = LocalDate.now();
        if (status == null) status = "ADMITTED";
    }

    // Getters & setters
    public Long getAdmissionId() { return admissionId; }
    public void setAdmissionId(Long admissionId) { this.admissionId = admissionId; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate admissionDate) { this.admissionDate = admissionDate; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getAdmittedBy() { return admittedBy; }
    public void setAdmittedBy(Long admittedBy) { this.admittedBy = admittedBy; }
}
