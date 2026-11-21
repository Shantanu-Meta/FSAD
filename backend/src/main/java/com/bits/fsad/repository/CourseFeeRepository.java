package com.bits.fsad.repository;

import com.bits.fsad.entity.CourseFee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseFeeRepository extends JpaRepository<CourseFee, Long> {
    List<CourseFee> findByCourseId(Long courseId);
    List<CourseFee> findByCourseIdAndAcademicYear(Long courseId, String academicYear);
}
