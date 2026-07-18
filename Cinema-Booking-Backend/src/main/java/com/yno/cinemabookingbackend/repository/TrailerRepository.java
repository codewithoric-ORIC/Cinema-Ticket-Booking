package com.yno.cinemabookingbackend.repository;

import com.yno.cinemabookingbackend.entitiy.Trailer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TrailerRepository extends JpaRepository<Trailer, Long> {
    List<Trailer> findByMovieId(Long movieId);
    @Modifying
    @Transactional
    void deleteByMovieId(Long movieId);
}
