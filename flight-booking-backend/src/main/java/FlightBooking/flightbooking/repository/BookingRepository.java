package FlightBooking.flightbooking.repository;

import FlightBooking.flightbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 1️⃣ Zboruri cele mai populare (cele mai multe booking-uri)
    @Query("SELECT b.flight.id, b.flight.flightNumber, COUNT(b.id) " +
            "FROM Booking b " +
            "GROUP BY b.flight.id, b.flight.flightNumber " +
            "ORDER BY COUNT(b.id) DESC")
    List<Object[]> findMostPopularFlights();

    // 2️⃣ Zboruri anulate (status = CANCELLED)
    @Query("SELECT b FROM Booking b WHERE b.status = 'CANCELLED' ORDER BY b.flight.flightNumber ASC")
    List<Booking> findCancelledFlights();

    List<Booking> findByStatus(String status);
    // Obține scaunele ocupate pentru un zbor
    @Query("SELECT b.seatNumber FROM Booking b WHERE b.flight.id = :flightId AND b.status = 'CONFIRMED'")
    List<String> findOccupiedSeatsByFlightId(Long flightId);

}
