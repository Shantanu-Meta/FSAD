package com.bits.fsad.repository;

import com.bits.fsad.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByCourseIdOrderBySemesterAsc(Long courseId);
    boolean existsByCourseIdAndSubjectCode(Long courseId, String subjectCode);
}
