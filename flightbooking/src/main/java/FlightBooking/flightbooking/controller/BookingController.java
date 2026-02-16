package FlightBooking.flightbooking.controller;

import FlightBooking.flightbooking.exception.ResourceNotFoundException;
import FlightBooking.flightbooking.model.Booking;
import FlightBooking.flightbooking.model.Flight;
import FlightBooking.flightbooking.model.User;
import FlightBooking.flightbooking.repository.BookingRepository;
import FlightBooking.flightbooking.repository.FlightRepository;
import FlightBooking.flightbooking.repository.UserRepository;
import FlightBooking.flightbooking.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final FlightRepository flightRepo;
    private final BookingService bookingService;

    public BookingController(BookingRepository bookingRepo,
                             UserRepository userRepo,
                             FlightRepository flightRepo,
                             BookingService bookingService) {
        this.bookingRepo = bookingRepo;
        this.userRepo = userRepo;
        this.flightRepo = flightRepo;
        this.bookingService = bookingService;
    }

    // 🔹 Toate rezervările
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // 🔹 Rezervare după ID
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
    }

    // 🔹 Creare rezervare
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        Long userId = booking.getUser().getId();
        Long flightId = booking.getFlight().getId();

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        Flight flight = flightRepo.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id " + flightId));

        List<String> occupiedSeats = bookingRepo.findOccupiedSeatsByFlightId(flightId);
        if (occupiedSeats.contains(booking.getSeatNumber())) {
            throw new RuntimeException("Acest scaun este deja ocupat. Alege altul.");
        }

        booking.setUser(user);
        booking.setFlight(flight);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        return bookingRepo.save(booking);
    }

    // 🔹 Scaunele libere pentru un zbor
    @GetMapping("/available-seats/{flightId}")
    public List<String> getAvailableSeats(@PathVariable Long flightId) {
        List<String> allSeats = new ArrayList<>();
        char[] cols = {'A', 'B', 'C', 'D', 'E', 'F'};
        for (int row = 1; row <= 25; row++) {
            for (char col : cols) {
                allSeats.add(row + String.valueOf(col));
            }
        }

        List<String> occupiedSeats = bookingRepo.findOccupiedSeatsByFlightId(flightId);
        allSeats.removeAll(occupiedSeats);

        return allSeats;
    }

    // 🔹 Actualizare rezervare
    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        return bookingRepo.findById(id)
                .map(b -> {
                    b.setSeatNumber(updatedBooking.getSeatNumber());
                    b.setStatus(updatedBooking.getStatus());
                    return bookingRepo.save(b);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
    }

    // 🔹 Anulare rezervare
    @PostMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    // 🔹 Ștergere rezervare (doar de către user-ul care a făcut-o)
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id, @RequestParam Long userId) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));

        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Nu ai permisiunea de a șterge această rezervare");
        }

        bookingRepo.delete(booking);
    }

    // Cele mai populare zboruri (după număr de rezervări)
    @GetMapping("/most-popular")
    public List<Object[]> getMostPopularFlights() {
        return bookingService.findMostPopularFlights();
    }

    // Rezervările anulate
    @GetMapping("/cancelled")
    public List<Booking> getCancelledBookings() {
        return bookingService.findCancelled();
    }
}
