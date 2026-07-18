package com.yno.cinemabookingbackend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateBookingRequest {
    private Long showTimeId;
    private List<Long> seatIds;
    private Double totalAmount;
}
