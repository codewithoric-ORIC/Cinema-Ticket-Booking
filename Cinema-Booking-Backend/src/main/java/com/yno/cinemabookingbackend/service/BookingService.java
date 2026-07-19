package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.request.CreateBookingRequest;
import com.yno.cinemabookingbackend.dto.response.*;
import com.yno.cinemabookingbackend.entitiy.*;
import com.yno.cinemabookingbackend.enumType.BookingStatus;
import com.yno.cinemabookingbackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowTimeRepository showTimeRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse createBooking(CreateBookingRequest request, Authentication auth) {

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
        return convertToBookingResponse(saveBooking);
    }

    public BookingResponse updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
        booking.setBookingStatus(BookingStatus.valueOf(status.toUpperCase()));
        return convertToBookingResponse(bookingRepository.save(booking));
    }

    private BookingSeatResponse convertToBookingSeatResponse(Seat seat) {
        return new BookingSeatResponse(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getRowChar(),
                seat.getCol(),
                seat.getPrice()
        );
    }

    private ShowTimeResponse convertToShowTimeResponse(ShowTime showTime) {
        MovieResponse movieResponse = null;
        if (showTime.getMovie() != null) {
            movieResponse = new MovieResponse(
                    showTime.getMovie().getId(),
                    showTime.getMovie().getTitle(),
                    showTime.getMovie().getDescription(),
                    showTime.getMovie().getRating(),
                    showTime.getMovie().getImageUrl(),
                    showTime.getMovie().getDuration(),
                    showTime.getMovie().getGenre(),
                    showTime.getMovie().getYear(),
                    showTime.getMovie().getReleaseDate(),
                    showTime.getMovie().getIsActive(),
                    null,
                    null
            );
        }

        TheaterResponse theaterResponse = null;
        if (showTime.getTheater() != null) {
            theaterResponse = new TheaterResponse(
                    showTime.getTheater().getId(),
                    showTime.getTheater().getName(),
                    showTime.getTheater().getLocation(),
                    showTime.getTheater().getTotalSeats()
            );
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        String formattedShowTime = showTime.getShowTime() != null ? showTime.getShowTime().format(timeFormatter) : null;

        return new ShowTimeResponse(
                showTime.getId(),
                theaterResponse,
                movieResponse,
                showTime.getMovie() != null ? showTime.getMovie().getId() : null,
                showTime.getMovie() != null ? showTime.getMovie().getTitle() : null,
                showTime.getShowDate(),
                formattedShowTime,
                showTime.getAvailableSeats()
        );
    }

    private BookingResponse convertToBookingResponse(Booking booking) {
        List<BookingSeatResponse> seatResponses = booking.getBookingSeats().stream()
                .map(bookingSeat -> convertToBookingSeatResponse(bookingSeat.getSeat()))
                .collect(Collectors.toList());

        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getTotalAmount(),
                booking.getBookingStatus().name(),
                convertToShowTimeResponse(booking.getShowTime()),
                seatResponses
        );
    }
}
