package com.yno.cinemabookingbackend.controller;

import com.yno.cinemabookingbackend.dto.request.CreateShowtimeRequest;
import com.yno.cinemabookingbackend.dto.response.ShowTimeResponse;
import com.yno.cinemabookingbackend.service.ShowTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/show-times")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ShowTimeController {
    private final ShowTimeService showTimeService;

    @GetMapping
    public ResponseEntity<List<ShowTimeResponse>> getAllShowtimes() {
        return ResponseEntity.ok(showTimeService.getAllShowTimes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowTimeResponse> getShowTimeById(@PathVariable Long id) {
        return ResponseEntity.ok(showTimeService.getShowTimeById(id));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowTimeResponse>> getShowtimesByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(showTimeService.getShowTimesByMovieId(movieId));
    }

    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<ShowTimeResponse>> getShowtimesByTheaterId(@PathVariable Long theaterId) {
        return ResponseEntity.ok(showTimeService.getShowTimesByTheaterId(theaterId));
    }

    @PostMapping
    public ResponseEntity<ShowTimeResponse> createShowtime(@RequestBody CreateShowtimeRequest request) {
        return ResponseEntity.ok(showTimeService.createShowTime(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
        showTimeService.deleteShowTime(id);
        return ResponseEntity.ok().build();
    }
}
