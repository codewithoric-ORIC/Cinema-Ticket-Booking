package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByIsActiveTrue();

    List<Movie> findByReleaseDateLessThanEqualAndIsActiveTrue(LocalDate date);

    List<Movie> findByReleaseDateGreaterThanEqualAndIsActiveTrue(LocalDate date);
}
