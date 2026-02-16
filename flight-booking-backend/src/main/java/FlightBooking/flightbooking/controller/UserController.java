package FlightBooking.flightbooking.controller;

import FlightBooking.flightbooking.exception.ResourceNotFoundException;
import FlightBooking.flightbooking.model.User;
import FlightBooking.flightbooking.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    // ✅ GET: toate conturile
    @GetMapping
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // ✅ GET: utilizator după ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    // ✅ POST: adaugă utilizator
    @PostMapping
    public User addUser(@RequestBody User user) {
        return repo.save(user);
    }

    // ✅ PUT: actualizează utilizator
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return repo.findById(id)
                .map(u -> {
                    u.setName(updatedUser.getName());
                    u.setEmail(updatedUser.getEmail());
                    u.setPasswordHash(updatedUser.getPasswordHash());
                    return repo.save(u);
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    // ✅ DELETE: șterge utilizator
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id " + id);
        }
        repo.deleteById(id);
    }
}
