package com.bits.fsad.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "course_fees")
public class CourseFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_id")
    private Long feeId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "fee_type", nullable = false, length = 60)
    private String feeType; // Tuition, Hostel, Exam, Library, ...

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear; // e.g. '2024-25'

    // Getters & setters
    public Long getFeeId() { return feeId; }
    public void setFeeId(Long feeId) { this.feeId = feeId; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getFeeType() { return feeType; }
    public void setFeeType(String feeType) { this.feeType = feeType; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
