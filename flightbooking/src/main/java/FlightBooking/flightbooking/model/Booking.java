package FlightBooking.flightbooking.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne @JoinColumn(name = "flight_id")
    private Flight flight;

    private LocalDateTime bookingDate;
    private String seatNumber;
    private String status; // CONFIRMED / CANCELLED
}
