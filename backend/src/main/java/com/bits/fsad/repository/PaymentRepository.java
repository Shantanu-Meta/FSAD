package com.bits.fsad.repository;

import com.bits.fsad.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByAdmissionId(Long admissionId);
}
