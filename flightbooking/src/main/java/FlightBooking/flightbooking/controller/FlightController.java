package FlightBooking.flightbooking.controller;

import FlightBooking.flightbooking.exception.ResourceNotFoundException;
import FlightBooking.flightbooking.model.Flight;
import FlightBooking.flightbooking.repository.FlightRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightRepository repo;

    public FlightController(FlightRepository repo) {
        this.repo = repo;
    }

    // ✅ GET: toate zborurile
    @GetMapping
    public List<Flight> getAllFlights() {
        return repo.findAll();
    }

    // ✅ GET: zbor după ID
    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id " + id));
    }

    // ✅ POST: adaugă zbor
    @PostMapping
    public Flight addFlight(@RequestBody Flight flight) {
        return repo.save(flight);
    }

    // ✅ PUT: actualizează zbor
    @PutMapping("/{id}")
    public Flight updateFlight(@PathVariable Long id, @RequestBody Flight updated) {
        return repo.findById(id).map(flight -> {
            flight.setAirline(updated.getAirline());
            flight.setFlightNumber(updated.getFlightNumber());
            flight.setDepartureAirport(updated.getDepartureAirport());
            flight.setArrivalAirport(updated.getArrivalAirport());
            flight.setDepartureTime(updated.getDepartureTime());
            flight.setArrivalTime(updated.getArrivalTime());
            flight.setPrice(updated.getPrice());
            return repo.save(flight);
        }).orElseThrow(() -> new ResourceNotFoundException("Flight not found with id " + id));
    }

    // ✅ DELETE: șterge zbor
    @DeleteMapping("/{id}")
    public void deleteFlight(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Flight not found with id " + id);
        }
        repo.deleteById(id);
    }
}
