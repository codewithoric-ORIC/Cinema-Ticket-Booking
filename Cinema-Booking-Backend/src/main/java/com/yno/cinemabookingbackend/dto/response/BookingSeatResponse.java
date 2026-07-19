package com.yno.cinemabookingbackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSeatResponse {
    private Long id;
    private String seatNumber;
    private String rowChar;
    private Integer col;
    private Double price;
}