package com.yno.cinemabookingbackend.controller;

import com.yno.cinemabookingbackend.dto.request.CreateTrailerRequest;
import com.yno.cinemabookingbackend.dto.response.TrailerResponse;
import com.yno.cinemabookingbackend.service.TrailerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trailers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TrailerController {
    private final TrailerService trailerService;

    @GetMapping
    public ResponseEntity<List<TrailerResponse>> getAllTrailers() {
        return ResponseEntity.ok(trailerService.getAllTrailers());
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<TrailerResponse>> getTrailersByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(trailerService.getTrailersByMovieId(movieId));
    }

    @PostMapping
    public ResponseEntity<TrailerResponse> createTrailer(@RequestBody CreateTrailerRequest request) {
        return ResponseEntity.ok(trailerService.createTrailer(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrailer(@PathVariable Long id) {
        trailerService.deleteTrailer(id);
        return ResponseEntity.ok().build();
    }
}
