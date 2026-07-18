package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.request.CreateCastRequest;
import com.yno.cinemabookingbackend.dto.response.CastResponse;
import com.yno.cinemabookingbackend.entitiy.Cast;
import com.yno.cinemabookingbackend.entitiy.Movie;
import com.yno.cinemabookingbackend.repository.CastRepository;
import com.yno.cinemabookingbackend.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CastService {
    private final CastRepository castRepository;
    private final MovieRepository movieRepository;

    public List<CastResponse> getAllCasts() {
        return castRepository.findAll().stream()
                .map(this::convertToCastResponse)
                .collect(Collectors.toList());
    }

    public List<CastResponse> getCastsByMovieId(Long movieId) {
        return castRepository.findByMovieId(movieId).stream()
                .map(this::convertToCastResponse)
                .collect(Collectors.toList());
    }

    public CastResponse createCast(CreateCastRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Cast cast = new Cast();
        cast.setName(request.getName());
        cast.setCharacterName(request.getCharacterName());
        cast.setAvatarUrl(request.getAvatarUrl());
        cast.setMovie(movie);
        Cast savedCast = castRepository.save(cast);
        return convertToCastResponse(savedCast);
    }

    public void deleteCast(Long id) {
        castRepository.deleteById(id);
    }

    private CastResponse convertToCastResponse(Cast cast) {
        Long movieId = null;
        String movieTitle = null;
        if (cast.getMovie() != null) {
            movieId = cast.getMovie().getId();
            movieTitle = cast.getMovie().getTitle();
        }
        return new CastResponse(
                cast.getId(),
                cast.getName(),
                cast.getCharacterName(),
                cast.getAvatarUrl(),
                movieId,
                movieTitle
        );
    }
}
