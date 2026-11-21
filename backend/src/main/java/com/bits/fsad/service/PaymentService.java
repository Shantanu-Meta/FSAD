package com.bits.fsad.service;

import com.bits.fsad.dto.InvoiceView;
import com.bits.fsad.dto.PaymentRequest;
import com.bits.fsad.dto.PaymentResult;
import com.bits.fsad.entity.*;
import com.bits.fsad.exception.BusinessException;
import com.bits.fsad.exception.ResourceNotFoundException;
import com.bits.fsad.repository.*;
import com.bits.fsad.security.CurrentUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final AdmissionRepository admissionRepository;
    private final CourseFeeRepository courseFeeRepository;
    private final ApplicationRepository applicationRepository;
    private final CourseRepository courseRepository;
    private final CurrentUser currentUser;

    public PaymentService(PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository,
                          AdmissionRepository admissionRepository,
                          CourseFeeRepository courseFeeRepository,
                          ApplicationRepository applicationRepository,
                          CourseRepository courseRepository,
                          CurrentUser currentUser) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.admissionRepository = admissionRepository;
        this.courseFeeRepository = courseFeeRepository;
        this.applicationRepository = applicationRepository;
        this.courseRepository = courseRepository;
        this.currentUser = currentUser;
    }

    public List<Payment> findByAdmission(Long admissionId) {
        return paymentRepository.findByAdmissionId(admissionId);
    }

    /**
     * Records a payment and generates its invoice in a single atomic
     * transaction (NFR-03). Both succeed or both roll back.
     */
    @Transactional
    public PaymentResult recordPayment(PaymentRequest req) {
        Admission admission = admissionRepository.findById(req.getAdmissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Admission not found: " + req.getAdmissionId()));
        CourseFee fee = courseFeeRepository.findById(req.getFeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee head not found: " + req.getFeeId()));

        if (!fee.getCourseId().equals(admission.getCourseId())) {
            throw new BusinessException("Selected fee head does not belong to the student's course");
        }

        Long userId = currentUser.getId();

        // 1. Record payment
        Payment payment = new Payment();
        payment.setAdmissionId(admission.getAdmissionId());
        payment.setFeeId(fee.getFeeId());
        payment.setAmountPaid(req.getAmountPaid());
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentMode(req.getPaymentMode());
        payment.setPaymentStatus("PAID");
        payment.setProcessedBy(userId);
        payment = paymentRepository.save(payment);

        // 2. Generate invoice linked to the payment
        Invoice invoice = new Invoice();
        invoice.setPaymentId(payment.getPaymentId());
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setTotalAmount(req.getAmountPaid());
        invoice.setGeneratedBy(userId);
        invoice = invoiceRepository.save(invoice);

        return new PaymentResult(payment, invoice);
    }

    public InvoiceView getInvoiceView(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));
        return buildView(invoice);
    }

    public InvoiceView getInvoiceViewByPayment(Long paymentId) {
        Invoice invoice = invoiceRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("No invoice for payment: " + paymentId));
        return buildView(invoice);
    }

    private InvoiceView buildView(Invoice invoice) {
        Payment payment = paymentRepository.findById(invoice.getPaymentId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + invoice.getPaymentId()));
        Admission admission = admissionRepository.findById(payment.getAdmissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Admission not found"));
        Application application = applicationRepository.findById(admission.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        Course course = courseRepository.findById(admission.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        CourseFee fee = courseFeeRepository.findById(payment.getFeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee not found"));

        InvoiceView v = new InvoiceView();
        v.setInvoiceId(invoice.getInvoiceId());
        v.setInvoiceNumber(invoice.getInvoiceNumber());
        v.setInvoiceDate(invoice.getInvoiceDate());
        v.setTotalAmount(invoice.getTotalAmount());
        v.setRollNumber(admission.getRollNumber());
        v.setApplicantName(application.getApplicantName());
        v.setCourseName(course.getCourseName());
        v.setCourseCode(course.getCourseCode());
        v.setAcademicYear(admission.getAcademicYear());
        v.setFeeType(fee.getFeeType());
        v.setPaymentMode(payment.getPaymentMode().name());
        v.setPaymentDate(payment.getPaymentDate());
        return v;
    }

    /** Unique invoice number: INV-YYYY-NNNNN (global sequence). */
    private String generateInvoiceNumber() {
        long count = invoiceRepository.count() + 1;
        return String.format("INV-%d-%05d", LocalDate.now().getYear(), count);
    }
}
