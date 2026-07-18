package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.response.SeatResponse;
import com.yno.cinemabookingbackend.entitiy.Seat;
import com.yno.cinemabookingbackend.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;

    public List<SeatResponse> getSeatByShowTimeId(Long showTimeId) {
        return seatRepository.findByShowTimeId(showTimeId).stream()
                .map(this::convertToSeatResponse)
                .collect(Collectors.toList());
    }

    private SeatResponse convertToSeatResponse(Seat seat) {
        return new SeatResponse(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getRowChar(),
                seat.getCol(),
                seat.getPrice(),
                seat.getIsBooked(),
                seat.getIsReserved()
        );
    }
}
