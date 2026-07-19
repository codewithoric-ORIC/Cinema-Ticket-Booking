package com.yno.cinemabookingbackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private Double totalAmount;
    private String bookingStatus;
    private ShowTimeResponse showTime;
    private List<BookingSeatResponse> seats;
}