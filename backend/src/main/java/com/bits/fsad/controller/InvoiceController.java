package com.bits.fsad.controller;

import com.bits.fsad.dto.InvoiceView;
import com.bits.fsad.service.PaymentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final PaymentService paymentService;

    public InvoiceController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /** Printable invoice details for the receipt screen. */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CLERK')")
    public InvoiceView get(@PathVariable Long id) {
        return paymentService.getInvoiceView(id);
    }

    @GetMapping("/payment/{paymentId}")
    @PreAuthorize("hasAnyRole('ADMIN','CLERK')")
    public InvoiceView byPayment(@PathVariable Long paymentId) {
        return paymentService.getInvoiceViewByPayment(paymentId);
    }
}
