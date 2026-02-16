package FlightBooking.flightbooking.controller;

import FlightBooking.flightbooking.model.Payment;
import FlightBooking.flightbooking.repository.PaymentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsForUser(@PathVariable Long userId) {
        return paymentRepository.findByBookingUserId(userId);
    }


    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentRepository.save(payment);
    }

    @PutMapping("/{id}")
    public Payment updatePayment(@PathVariable Long id, @RequestBody Payment paymentDetails) {
        return paymentRepository.findById(id).map(payment -> {
            payment.setAmount(paymentDetails.getAmount());
            payment.setMethod(paymentDetails.getMethod());
            payment.setPaymentDate(paymentDetails.getPaymentDate());
            payment.setStatus(paymentDetails.getStatus());
            payment.setBooking(paymentDetails.getBooking());
            return paymentRepository.save(payment);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable Long id) {
        paymentRepository.deleteById(id);
    }
}
