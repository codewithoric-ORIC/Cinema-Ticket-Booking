package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
}
