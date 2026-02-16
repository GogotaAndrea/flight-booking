package FlightBooking.flightbooking.service;

import FlightBooking.flightbooking.model.Booking;
import FlightBooking.flightbooking.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    // ✅ Creează o rezervare nouă
    public Booking addBooking(Booking booking) {
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        return repo.save(booking);
    }

    // ✅ Caută rezervare după ID
    public Optional<Booking> findById(Long id) {
        return repo.findById(id);
    }

    // ✅ Anulează o rezervare
    public Booking cancelBooking(Long id) {
        Booking booking = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CANCELLED");
        return repo.save(booking);
    }

    // ✅ Găsește rezervările anulate
    public List<Booking> findCancelled() {
        return repo.findCancelledFlights(); // folosim query-ul din repository
    }

    // ✅ Găsește cele mai populare zboruri (după număr de rezervări)
    public List<Object[]> findMostPopularFlights() {
        return repo.findMostPopularFlights();
    }
}
