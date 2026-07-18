package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByShowTimeId(Long showTimeId);
}
