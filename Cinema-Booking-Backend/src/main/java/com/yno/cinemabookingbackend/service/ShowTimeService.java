package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.request.CreateShowtimeRequest;
import com.yno.cinemabookingbackend.dto.response.MovieResponse;
import com.yno.cinemabookingbackend.dto.response.SeatResponse;
import com.yno.cinemabookingbackend.dto.response.ShowTimeResponse;
import com.yno.cinemabookingbackend.dto.response.TheaterResponse;
import com.yno.cinemabookingbackend.entitiy.Movie;
import com.yno.cinemabookingbackend.entitiy.Seat;
import com.yno.cinemabookingbackend.entitiy.ShowTime;
import com.yno.cinemabookingbackend.entitiy.Theater;
import com.yno.cinemabookingbackend.repository.MovieRepository;
import com.yno.cinemabookingbackend.repository.ShowTimeRepository;
import com.yno.cinemabookingbackend.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowTimeService {
    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

    public List<ShowTimeResponse> getAllShowTimes() {
        return showTimeRepository.findAll().stream()
                .map(this::convertToShowTimeResponse)
                .collect(Collectors.toList());
    }

    public ShowTimeResponse getShowTimeById(Long showTimeId) {
        ShowTime showTime = showTimeRepository.findById(showTimeId).orElseThrow(() -> new RuntimeException("ShowTime not found"));
        return convertToShowTimeResponse(showTime);
    }

    public List<ShowTimeResponse> getShowTimesByMovieId(Long movieId) {
        return showTimeRepository.findByMovieId(movieId).stream()
                .map(this::convertToShowTimeResponse)
                .collect(Collectors.toList());
    }

    public List<ShowTimeResponse> getShowTimesByTheaterId(Long theaterId) {
        return showTimeRepository.findByTheaterId(theaterId).stream()
                .map(this::convertToShowTimeResponse)
                .collect(Collectors.toList());
    }

    public ShowTimeResponse createShowTime(CreateShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Theater theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        ShowTime showTime = new ShowTime();
        showTime.setShowDate(request.getShowDate());
        showTime.setShowTime(request.getShowTime());
        showTime.setAvailableSeats(request.getAvailableSeats());
        showTime.setMovie(movie);
        showTime.setTheater(theater);
        ShowTime savedShowTime = showTimeRepository.save(showTime);
        return convertToShowTimeResponse(savedShowTime);
    }

    public void deleteShowTime(Long showTimeId) {
        showTimeRepository.deleteById(showTimeId);
    }

    private SeatResponse convertToSeatResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .rowChar(seat.getRowChar())
                .col(seat.getCol())
                .price(seat.getPrice())
                .isBooked(seat.getIsBooked())
                .isReserved(seat.getIsReserved())
                .build();
    }

    private ShowTimeResponse convertToShowTimeResponse(ShowTime showTime) {
        Theater theater = showTime.getTheater();
        TheaterResponse theaterResponse = new TheaterResponse(
                theater.getId(),
                theater.getName(),
                theater.getLocation(),
                theater.getTotalSeats()
        );

        Movie movie = showTime.getMovie();
        MovieResponse movieResponse = null;
        if (movie != null) {
            movieResponse = new MovieResponse(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getDescription(),
                    movie.getRating(),
                    movie.getImageUrl(),
                    movie.getDuration(),
                    movie.getGenre(),
                    movie.getYear(),
                    movie.getReleaseDate(),
                    movie.getIsActive(),
                    null,
                    null
            );
        }

        List<SeatResponse> seatResponses = null;
        if (showTime.getSeats() != null) {
            seatResponses = showTime.getSeats().stream()
                    .map(this::convertToSeatResponse)
                    .collect(Collectors.toList());
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        return new ShowTimeResponse(
                showTime.getId(),
                theaterResponse,
                movieResponse,
                movie != null ? movie.getId() : null,
                movie != null ? movie.getTitle() : null,
                showTime.getShowDate(),
                showTime.getShowTime().format(timeFormatter),
                showTime.getAvailableSeats(),
                seatResponses
        );
    }
}
