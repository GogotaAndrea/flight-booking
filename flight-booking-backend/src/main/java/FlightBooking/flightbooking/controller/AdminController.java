package FlightBooking.flightbooking.controller;

import FlightBooking.flightbooking.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final BookingRepository repo;
    public AdminController(BookingRepository repo){this.repo=repo;}

    @GetMapping("/most-popular-flights")
    public List<Map<String,Object>> getMostPopularFlights(){
        return repo.findMostPopularFlights().stream().map(obj -> {
            Map<String,Object> map = new HashMap<>();
            map.put("flightId", obj[0]);
            map.put("flightNumber", obj[1]);
            map.put("count", obj[2]);
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/cancelled-bookings")
    public Object getCancelledBookings(){
        return repo.findByStatus("CANCELLED");
    }
}
