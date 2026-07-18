package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.request.CreateBookingRequest;
import com.yno.cinemabookingbackend.entitiy.*;
import com.yno.cinemabookingbackend.enumType.BookingStatus;
import com.yno.cinemabookingbackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowTimeRepository showTimeRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking createBooking(CreateBookingRequest request, Authentication auth) {

        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        ShowTime showTime = showTimeRepository.findById(request.getShowTimeId()).orElseThrow(() -> new RuntimeException("ShowTime not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowTime(showTime);
        booking.setTotalAmount(request.getTotalAmount());
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setBookingReference(UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Booking saveBooking = bookingRepository.save(booking);

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        seats.forEach(seat -> {
            seat.setIsBooked(true);
            seatRepository.save(seat);

            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(saveBooking);
            bookingSeat.setSeat(seat);
            bookingSeatRepository.save(bookingSeat);
        });
        return saveBooking;
    }

    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
        booking.setBookingStatus(BookingStatus.valueOf(status.toUpperCase()));
        return bookingRepository.save(booking);
    }
}
