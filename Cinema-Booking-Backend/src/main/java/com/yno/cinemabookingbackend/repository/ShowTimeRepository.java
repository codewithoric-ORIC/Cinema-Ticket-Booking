package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {
    List<ShowTime> findByTheaterId(Long theaterId);
    List<ShowTime> findByMovieId(Long movieId);
    @Modifying
    @Transactional
    void deleteByMovieId(Long movieId);
}
