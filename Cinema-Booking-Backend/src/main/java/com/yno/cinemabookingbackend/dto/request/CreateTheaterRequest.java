package com.yno.cinemabookingbackend.dto.request;

import lombok.Data;

@Data
public class CreateTheaterRequest {
    private String name;
    private String location;
    private Integer totalSeats;
}
