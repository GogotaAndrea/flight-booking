package FlightBooking.flightbooking.controller;

import FlightBooking.flightbooking.model.Flight;
import FlightBooking.flightbooking.repository.FlightRepository;
import FlightBooking.flightbooking.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiService aiService;
    private final FlightRepository flightRepository;

    public AiController(AiService aiService, FlightRepository flightRepository) {
        this.aiService = aiService;
        this.flightRepository = flightRepository;
    }

    /**
     * Predicts the possible future price of a given flight using the local Ollama AI model.
     */
    @PostMapping("/predict/{flightId}")
    public ResponseEntity<?> predict(@PathVariable Long flightId) {
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Flight not found"));
        }

        // Context we send to the AI model
        Map<String, Object> ctx = new HashMap<>();
        ctx.put("flightNumber", flight.getFlightNumber());
        ctx.put("airline", flight.getAirline());
        ctx.put("origin", flight.getDepartureAirport());
        ctx.put("destination", flight.getArrivalAirport());
        ctx.put("price", flight.getPrice());
        ctx.put("departureTime", flight.getDepartureTime() != null ? flight.getDepartureTime().toString() : null);
        ctx.put("arrivalTime", flight.getArrivalTime() != null ? flight.getArrivalTime().toString() : null);

        // Call AI service that interacts with Ollama
        String aiText = aiService.predictPriceForFlight(flightId, ctx);

        return ResponseEntity.ok(Map.of(
                "flightId", flightId,
                "flightNumber", flight.getFlightNumber(),
                "modelOutput", aiText
        ));
    }
}
