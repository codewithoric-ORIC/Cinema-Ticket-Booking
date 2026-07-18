package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.request.CreateTrailerRequest;
import com.yno.cinemabookingbackend.dto.response.TrailerResponse;
import com.yno.cinemabookingbackend.entitiy.Movie;
import com.yno.cinemabookingbackend.entitiy.Trailer;
import com.yno.cinemabookingbackend.repository.MovieRepository;
import com.yno.cinemabookingbackend.repository.TrailerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrailerService {
    private final TrailerRepository trailerRepository;
    private final MovieRepository movieRepository;

    public List<TrailerResponse> getAllTrailers() {
        return trailerRepository.findAll().stream()
                .map(this::convertToTrailerResponse)
                .collect(Collectors.toList());
    }

    public List<TrailerResponse> getTrailersByMovieId(Long movieId) {
        return trailerRepository.findByMovieId(movieId).stream()
                .map(this::convertToTrailerResponse)
                .collect(Collectors.toList());
    }

    public TrailerResponse createTrailer(CreateTrailerRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Trailer trailer = new Trailer();
        trailer.setTitle(request.getTitle());
        trailer.setDuration(request.getDuration());
        trailer.setYoutubeId(request.getYoutubeId());
        trailer.setThumbnailUrl(request.getThumbnailUrl());
        trailer.setMovie(movie);
        Trailer savedTrailer = trailerRepository.save(trailer);
        return convertToTrailerResponse(savedTrailer);
    }

    public void deleteTrailer(Long id) {
        trailerRepository.deleteById(id);
    }

    private TrailerResponse convertToTrailerResponse(Trailer trailer) {
        Long movieId = null;
        if (trailer.getMovie() != null) {
            movieId = trailer.getMovie().getId();
        }
        return new TrailerResponse(
                trailer.getId(),
                trailer.getTitle(),
                trailer.getDuration(),
                trailer.getYoutubeId(),
                trailer.getThumbnailUrl(),
                movieId
        );
    }
}
