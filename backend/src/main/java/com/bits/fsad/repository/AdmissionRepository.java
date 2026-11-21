package com.bits.fsad.repository;

import com.bits.fsad.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByRollNumber(String rollNumber);
    Optional<Admission> findByApplicationId(Long applicationId);
    long countByCourseIdAndAcademicYear(Long courseId, String academicYear);
    long countByCourseId(Long courseId);
    List<Admission> findAllByOrderByAdmissionDateDesc();
}
