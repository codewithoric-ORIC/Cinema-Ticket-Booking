package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.ShowTime;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {
    @EntityGraph(attributePaths = {"seats", "movie", "theater"})
    List<ShowTime> findByTheaterId(Long theaterId);

    @EntityGraph(attributePaths = {"seats", "movie", "theater"})
    List<ShowTime> findByMovieId(Long movieId);

    @EntityGraph(attributePaths = {"seats", "movie", "theater"})
    Optional<ShowTime> findById(Long id);

    @EntityGraph(attributePaths = {"seats", "movie", "theater"})
    List<ShowTime> findAll();

    @Modifying
    @Transactional
    void deleteByMovieId(Long movieId);
}
