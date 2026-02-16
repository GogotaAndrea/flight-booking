package FlightBooking.flightbooking.controller;

import FlightBooking.flightbooking.model.User;
import FlightBooking.flightbooking.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        System.out.println("Received user: " + user); // debug
        user.setPasswordHash(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Login
    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                return user;
            }
        }
        throw new RuntimeException("Email sau parola incorectă");
    }
}
