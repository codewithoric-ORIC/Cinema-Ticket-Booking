package com.yno.cinemabookingbackend.controller;

import com.yno.cinemabookingbackend.dto.request.CreateMovieRequest;
import com.yno.cinemabookingbackend.dto.response.MovieResponse;
import com.yno.cinemabookingbackend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {
    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieResponse>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @GetMapping("/current")
    public ResponseEntity<List<MovieResponse>> getCurrentMovies() {
        return ResponseEntity.ok(movieService.getCurrentMovies());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<MovieResponse>> getUpcomingMovies() {
        return ResponseEntity.ok(movieService.getUpcomingMovies());
    }

    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<MovieResponse>> getMoviesByTheaterId(@PathVariable Long theaterId) {
        return ResponseEntity.ok(movieService.getMoviesByTheaterId(theaterId));
    }

    @PostMapping
    public ResponseEntity<MovieResponse> createMovie(@RequestBody CreateMovieRequest request) {
        return ResponseEntity.ok(movieService.createMovie(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok().build();
    }
}
