package com.yno.cinemabookingbackend.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateMovieRequest {
    private String title;
    private String description;
    private Double rating;
    private String imageUrl;
    private Integer duration;
    private String genre;
    private Integer year;
    private LocalDate releaseDate;
    private Boolean isActive;
}
