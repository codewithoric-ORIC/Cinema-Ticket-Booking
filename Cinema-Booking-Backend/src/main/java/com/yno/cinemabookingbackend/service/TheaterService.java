package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.request.CreateTheaterRequest;
import com.yno.cinemabookingbackend.dto.response.TheaterResponse;
import com.yno.cinemabookingbackend.entitiy.Theater;
import com.yno.cinemabookingbackend.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheaterService {
    private final TheaterRepository theaterRepository;

    public List<TheaterResponse> getAllTheater() {
        return theaterRepository.findAll().stream()
                .map(this::convertToTheaterResponse)
                .collect(Collectors.toList());
    }

    public TheaterResponse getTheaterById(Long theaterId) {
        Theater theater = theaterRepository.findById(theaterId).orElseThrow(() -> new RuntimeException("Theater not found"));
        return convertToTheaterResponse(theater);
    }

    public TheaterResponse createTheater(CreateTheaterRequest request) {
        Theater theater = new Theater();
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setTotalSeats(request.getTotalSeats());
        Theater savedTheater = theaterRepository.save(theater);
        return convertToTheaterResponse(savedTheater);
    }

    public void deleteTheater(Long theaterId) {
        theaterRepository.deleteById(theaterId);
    }

    private TheaterResponse convertToTheaterResponse(Theater theater) {
        return new TheaterResponse(
                theater.getId(),
                theater.getName(),
                theater.getLocation(),
                theater.getTotalSeats()
        );
    }
}
