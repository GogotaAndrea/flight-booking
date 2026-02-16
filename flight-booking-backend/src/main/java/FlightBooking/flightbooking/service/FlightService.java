package FlightBooking.flightbooking.service;

import FlightBooking.flightbooking.model.Flight;
import FlightBooking.flightbooking.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlightService {
    private final FlightRepository repo;

    public FlightService(FlightRepository repo) {
        this.repo = repo;
    }

    public List<Flight> getAllFlights() {
        return repo.findAll();
    }

    public Optional<Flight> getFlight(Long id) {
        return repo.findById(id);
    }

    public Flight addFlight(Flight flight) {
        return repo.save(flight);
    }

    public void deleteFlight(Long id) {
        repo.deleteById(id);
    }
}
