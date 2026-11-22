package com.bits.fsad.controller;

import com.bits.fsad.dto.PaymentRequest;
import com.bits.fsad.dto.PaymentResult;
import com.bits.fsad.entity.Payment;
import com.bits.fsad.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /** Clerk records a payment; invoice is created atomically. */
    @PostMapping
    @PreAuthorize("hasRole('CLERK')")
    public ResponseEntity<PaymentResult> record(@Valid @RequestBody PaymentRequest req) {
        return ResponseEntity.ok(paymentService.recordPayment(req));
    }

    @GetMapping("/admission/{admissionId}")
    @PreAuthorize("hasAnyRole('ADMIN','CLERK')")
    public List<Payment> byAdmission(@PathVariable Long admissionId) {
        return paymentService.findByAdmission(admissionId);
    }
}
