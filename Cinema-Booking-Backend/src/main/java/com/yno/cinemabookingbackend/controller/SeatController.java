package com.yno.cinemabookingbackend.controller;

import com.yno.cinemabookingbackend.dto.response.SeatResponse;
import com.yno.cinemabookingbackend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SeatController {
    private final SeatService seatService;

    @GetMapping("/showtime/{showTimeId}")
    public ResponseEntity<List<SeatResponse>> getSeatsByShowTimeId(@PathVariable Long showTimeId) {
        return ResponseEntity.ok(seatService.getSeatByShowTimeId(showTimeId));
    }
}