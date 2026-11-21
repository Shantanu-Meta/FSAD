package com.bits.fsad.repository;

import com.bits.fsad.entity.Application;
import com.bits.fsad.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStatusOrderByCreatedAtDesc(ApplicationStatus status);
    List<Application> findAllByOrderByCreatedAtDesc();
    long countByStatus(ApplicationStatus status);
    long countByCourseId(Long courseId);
}
