package com.yno.cinemabookingbackend.controller;

import com.yno.cinemabookingbackend.dto.request.CreateCastRequest;
import com.yno.cinemabookingbackend.dto.response.CastResponse;
import com.yno.cinemabookingbackend.service.CastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/casts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CastController {
    private final CastService castService;

    @GetMapping
    public ResponseEntity<List<CastResponse>> getAllCasts() {
        return ResponseEntity.ok(castService.getAllCasts());
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<CastResponse>> getCastsByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(castService.getCastsByMovieId(movieId));
    }

    @PostMapping
    public ResponseEntity<CastResponse> createCast(@RequestBody CreateCastRequest request) {
        return ResponseEntity.ok(castService.createCast(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCast(@PathVariable Long id) {
        castService.deleteCast(id);
        return ResponseEntity.ok().build();
    }
}
