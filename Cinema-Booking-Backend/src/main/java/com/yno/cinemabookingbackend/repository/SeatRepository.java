package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    @Query("SELECT s FROM Seat s WHERE s.showTime.id = :showTimeId")
    List<Seat> findByShowTimeId(@Param("showTimeId") Long showTimeId);
}
