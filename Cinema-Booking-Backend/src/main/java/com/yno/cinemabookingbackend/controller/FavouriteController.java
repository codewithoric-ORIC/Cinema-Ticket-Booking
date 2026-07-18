package com.yno.cinemabookingbackend.controller;

import com.yno.cinemabookingbackend.dto.request.FavouriteRequest;
import com.yno.cinemabookingbackend.dto.response.FavouriteResponse;
import com.yno.cinemabookingbackend.entitiy.User;
import com.yno.cinemabookingbackend.repository.UserRepository;
import com.yno.cinemabookingbackend.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FavouriteController {
    private final FavouriteService favouriteService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<FavouriteResponse>> getUserFavourites(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(favouriteService.getUserFavourites(user.getId()));
    }

    @GetMapping("/check/{movieId}")
    public ResponseEntity<Boolean> isFavourite(@PathVariable Long movieId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(favouriteService.isFavourite(user.getId(), movieId));
    }

    @PostMapping
    public ResponseEntity<FavouriteResponse> addFavourite(@RequestBody FavouriteRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(favouriteService.addFavourite(user.getId(), request.getMovieId()));
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> removeFavourite(@PathVariable Long movieId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        favouriteService.removeFavourite(user.getId(), movieId);
        return ResponseEntity.ok().build();
    }
}