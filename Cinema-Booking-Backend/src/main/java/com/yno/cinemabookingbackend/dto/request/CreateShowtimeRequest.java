package com.yno.cinemabookingbackend.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateShowtimeRequest {
    private LocalDate showDate;
    private LocalTime showTime;
    private Integer availableSeats;
    private Long movieId;
    private Long theaterId;
}
