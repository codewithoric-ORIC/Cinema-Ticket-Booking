package com.yno.cinemabookingbackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieResponse {
    private Long id;
    private String title;
    private String description;
    private Double rating;
    private String imageUrl;
    private Integer duration;
    private String genre;
    private Integer year;
    private LocalDate releaseDate;
    private Boolean isActive;
    private List<CastResponse> cast;
    private List<TrailerResponse> trailers;
}
