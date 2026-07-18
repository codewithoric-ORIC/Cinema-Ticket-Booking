package com.yno.cinemabookingbackend.entitiy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@RequiredArgsConstructor
@Table(name = "movies")
public class Movie extends IdClass{
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Double rating;
    @Column(name = "image_url")
    private String imageUrl;
    private Integer duration;
    private String genre;
    private Integer year;
    @Column(name = "release_date")
    private LocalDate releaseDate;
    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "movie")
    private List<Trailer> trailers;

    @OneToMany(mappedBy = "movie")
    private List<Cast> casts;

    @OneToMany(mappedBy = "movie")
    private List<ShowTime> showTimes;

    @OneToMany(mappedBy = "movie")
    private List<Favourite> favourites;
}
