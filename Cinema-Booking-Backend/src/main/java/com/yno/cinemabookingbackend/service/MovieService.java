package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.request.CreateMovieRequest;
import com.yno.cinemabookingbackend.dto.response.CastResponse;
import com.yno.cinemabookingbackend.dto.response.MovieResponse;
import com.yno.cinemabookingbackend.dto.response.TrailerResponse;
import com.yno.cinemabookingbackend.entitiy.Movie;
import com.yno.cinemabookingbackend.repository.CastRepository;
import com.yno.cinemabookingbackend.repository.FavouriteRepository;
import com.yno.cinemabookingbackend.repository.MovieRepository;
import com.yno.cinemabookingbackend.repository.ShowTimeRepository;
import com.yno.cinemabookingbackend.repository.TrailerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final CastRepository castRepository;
    private final TrailerRepository trailerRepository;
    private final ShowTimeRepository showTimeRepository;
    private final FavouriteRepository favouriteRepository;

    public List<MovieResponse> getAllMovies() {
        return movieRepository.findByIsActiveTrue().stream()
                .map(this::mapToMovieResponse)
                .collect(Collectors.toList());
    }

    public MovieResponse getMovieById(Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                () -> new RuntimeException("Movie not found!!")
        );
        return mapToMovieResponse(movie);
    }

    public List<MovieResponse> getCurrentMovies() {
        return movieRepository.findByReleaseDateLessThanEqualAndIsActiveTrue(LocalDate.now()).stream()
                .map(this::mapToMovieResponse)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getUpcomingMovies() {
        return movieRepository.findByReleaseDateGreaterThanEqualAndIsActiveTrue(LocalDate.now()).stream()
                .map(this::mapToMovieResponse)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getMoviesByTheaterId(Long theaterId) {
        return showTimeRepository.findByTheaterId(theaterId).stream()
                .map(showTime -> showTime.getMovie())
                .distinct()
                .map(this::mapToMovieResponse)
                .collect(Collectors.toList());
    }

    public MovieResponse createMovie(CreateMovieRequest request) {
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setRating(request.getRating());
        movie.setImageUrl(request.getImageUrl());
        movie.setDuration(request.getDuration());
        movie.setGenre(request.getGenre());
        movie.setYear(request.getYear());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        Movie savedMovie = movieRepository.save(movie);
        return mapToMovieResponse(savedMovie);
    }

    @Transactional
    public void deleteMovie(Long movieId) {
        // Delete all related entities first
        favouriteRepository.deleteByMovieId(movieId);
        castRepository.deleteByMovieId(movieId);
        trailerRepository.deleteByMovieId(movieId);
        showTimeRepository.deleteByMovieId(movieId);
        // Then delete the movie
        movieRepository.deleteById(movieId);
    }

    private MovieResponse mapToMovieResponse(Movie movie) {
        List<CastResponse> castResponses = movie.getCasts() != null ? movie.getCasts().stream()
                .map(cast -> new CastResponse(
                        cast.getId(),
                        cast.getName(),
                        cast.getCharacterName(),
                        cast.getAvatarUrl(),
                        movie.getId(),
                        movie.getTitle()
                ))
                .collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>();

        List<TrailerResponse> trailerResponses = movie.getTrailers() != null ? movie.getTrailers().stream()
                .map(trailer -> new TrailerResponse(
                        trailer.getId(),
                        trailer.getTitle(),
                        trailer.getDuration(),
                        trailer.getYoutubeId(),
                        trailer.getThumbnailUrl(),
                        movie.getId()
                ))
                .collect(Collectors.toList()) : new java.util.ArrayList<>();

        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getDescription(),
                movie.getRating(),
                movie.getImageUrl(),
                movie.getDuration(),
                movie.getGenre(),
                movie.getYear(),
                movie.getReleaseDate(),
                movie.getIsActive(),
                castResponses,
                trailerResponses
        );
    }
}
