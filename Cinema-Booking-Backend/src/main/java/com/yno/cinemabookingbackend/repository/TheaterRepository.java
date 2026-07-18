package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheaterRepository extends JpaRepository<Theater, Long> {
}
