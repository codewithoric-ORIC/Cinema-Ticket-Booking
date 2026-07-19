package com.yno.cinemabookingbackend.controller;

import com.yno.cinemabookingbackend.dto.request.CreateBookingRequest;
import com.yno.cinemabookingbackend.dto.response.BookingResponse;
import com.yno.cinemabookingbackend.entitiy.User;
import com.yno.cinemabookingbackend.repository.UserRepository;
import com.yno.cinemabookingbackend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    private final BookingService bookingService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user")
    public ResponseEntity<List<BookingResponse>> getUserBookings(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(bookingService.getBookingsByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody CreateBookingRequest request, Authentication authentication) {
        return ResponseEntity.ok(bookingService.createBooking(request, authentication));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }
}