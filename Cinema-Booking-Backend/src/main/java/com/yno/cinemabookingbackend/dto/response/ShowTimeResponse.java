package com.yno.cinemabookingbackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowTimeResponse {
    private Long id;
    private TheaterResponse theater;
    private MovieResponse movie;
    private Long movieId;
    private String movieTitle;
    private LocalDate showDate;
    private String showTime;
    private Integer availableSeats;
    private List<SeatResponse> seats;
}