package FlightBooking.flightbooking.service;

import FlightBooking.flightbooking.model.Payment;
import FlightBooking.flightbooking.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository repo;

    public PaymentService(PaymentRepository repo) {
        this.repo = repo;
    }

    public Payment addPayment(Payment payment) {
        payment.setPaymentDate(LocalDateTime.now());
        return repo.save(payment);
    }

    public List<Payment> getAll() {
        return repo.findAll();
    }
}
