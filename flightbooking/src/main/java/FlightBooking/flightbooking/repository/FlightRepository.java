package FlightBooking.flightbooking.repository;

import FlightBooking.flightbooking.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface FlightRepository extends JpaRepository<Flight, Long> {}
