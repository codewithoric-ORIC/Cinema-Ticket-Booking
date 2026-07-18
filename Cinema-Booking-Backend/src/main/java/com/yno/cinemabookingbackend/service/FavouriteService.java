package com.yno.cinemabookingbackend.service;

import com.yno.cinemabookingbackend.dto.response.FavouriteResponse;
import com.yno.cinemabookingbackend.dto.response.MovieResponse;
import com.yno.cinemabookingbackend.entitiy.Favourite;
import com.yno.cinemabookingbackend.entitiy.Movie;
import com.yno.cinemabookingbackend.entitiy.User;
import com.yno.cinemabookingbackend.repository.FavouriteRepository;
import com.yno.cinemabookingbackend.repository.MovieRepository;
import com.yno.cinemabookingbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavouriteService {
    private final FavouriteRepository favouriteRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public List<FavouriteResponse> getUserFavourites(Long userId) {
        return favouriteRepository.findByUserId(userId).stream()
                .map(this::convertToFavouriteResponse)
                .collect(Collectors.toList());
    }

    public boolean isFavourite(Long userId, Long movieId) {
        return favouriteRepository.existsByUserIdAndMovieId(userId, movieId);
    }

    @Transactional
    public FavouriteResponse addFavourite(Long userId, Long movieId) {
        if (favouriteRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new RuntimeException("Movie already in favourites");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new RuntimeException("Movie not found"));

        Favourite favourite = new Favourite();
        favourite.setUser(user);
        favourite.setMovie(movie);
        Favourite savedFavourite = favouriteRepository.save(favourite);

        return convertToFavouriteResponse(savedFavourite);
    }

    @Transactional
    public void removeFavourite(Long userId, Long movieId) {
        Favourite favourite = favouriteRepository.findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new RuntimeException("Favourite not found"));
        favouriteRepository.delete(favourite);
    }

    private FavouriteResponse convertToFavouriteResponse(Favourite favourite) {
        Movie movie = favourite.getMovie();
        MovieResponse movieResponse = new MovieResponse(
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
                null,
                null
        );

        return new FavouriteResponse(favourite.getId(), movieResponse);
    }
}