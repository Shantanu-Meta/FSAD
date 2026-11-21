package com.bits.fsad.dto;

import com.bits.fsad.entity.Invoice;
import com.bits.fsad.entity.Payment;

/** Combined payment + invoice returned after a successful fee collection. */
public class PaymentResult {
    private Payment payment;
    private Invoice invoice;

    public PaymentResult(Payment payment, Invoice invoice) {
        this.payment = payment;
        this.invoice = invoice;
    }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
}
