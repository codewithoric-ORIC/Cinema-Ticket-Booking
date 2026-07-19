package com.yno.cinemabookingbackend;

import com.yno.cinemabookingbackend.entitiy.Cast;
import com.yno.cinemabookingbackend.entitiy.Movie;
import com.yno.cinemabookingbackend.entitiy.ShowTime;
import com.yno.cinemabookingbackend.entitiy.Theater;
import com.yno.cinemabookingbackend.entitiy.Trailer;
import com.yno.cinemabookingbackend.entitiy.User;
import com.yno.cinemabookingbackend.enumType.Role;
import com.yno.cinemabookingbackend.repository.CastRepository;
import com.yno.cinemabookingbackend.repository.MovieRepository;
import com.yno.cinemabookingbackend.repository.ShowTimeRepository;
import com.yno.cinemabookingbackend.repository.TheaterRepository;
import com.yno.cinemabookingbackend.repository.TrailerRepository;
import com.yno.cinemabookingbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
public class CinemaBookingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CinemaBookingBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder, MovieRepository movieRepository, TheaterRepository theaterRepository, CastRepository castRepository, TrailerRepository trailerRepository, ShowTimeRepository showTimeRepository) {
        return args -> {
            // Check if admin already exists
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@cinema.com");
                admin.setPhoneNumber("09123456789");
                admin.setRole(Role.ROLE_ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user created successfully!");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
            } else {
                System.out.println("Admin user already exists!");
            }

            // Seed initial movies
            Movie movie1 = null;
            Movie movie2 = null;
            Movie movie3 = null;
            if (movieRepository.count() == 0) {
                movie1 = new Movie();
                movie1.setTitle("Inception");
                movie1.setDescription("A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.");
                movie1.setRating(8.8);
                movie1.setImageUrl("https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg");
                movie1.setDuration(148);
                movie1.setGenre("Sci-Fi, Thriller");
                movie1.setYear(2010);
                movie1.setReleaseDate(java.time.LocalDate.of(2010, 7, 16));
                movie1.setIsActive(true);
                movie1 = movieRepository.save(movie1);

                movie2 = new Movie();
                movie2.setTitle("The Dark Knight");
                movie2.setDescription("When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.");
                movie2.setRating(9.0);
                movie2.setImageUrl("https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef8ck.jpg");
                movie2.setDuration(152);
                movie2.setGenre("Action, Crime, Drama");
                movie2.setYear(2008);
                movie2.setReleaseDate(java.time.LocalDate.of(2008, 7, 18));
                movie2.setIsActive(true);
                movie2 = movieRepository.save(movie2);

                // Add upcoming movies
                movie3 = new Movie();
                movie3.setTitle("Avatar 3");
                movie3.setDescription("The next installment in the Avatar franchise.");
                movie3.setRating(0.0);
                movie3.setImageUrl("https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg");
                movie3.setDuration(180);
                movie3.setGenre("Sci-Fi, Adventure");
                movie3.setYear(2026);
                movie3.setReleaseDate(java.time.LocalDate.of(2026, 12, 18));
                movie3.setIsActive(true);
                movie3 = movieRepository.save(movie3);

                Movie movie4 = new Movie();
                movie4.setTitle("Mission: Impossible 8");
                movie4.setDescription("Ethan Hunt and his IMF team embark on their most dangerous mission yet.");
                movie4.setRating(0.0);
                movie4.setImageUrl("https://image.tmdb.org/t/p/w500/3BH0UfLd7Fvq58n0p7JQ5J8H5oG.jpg");
                movie4.setDuration(163);
                movie4.setGenre("Action, Thriller");
                movie4.setYear(2025);
                movie4.setReleaseDate(java.time.LocalDate.of(2025, 8, 15));
                movie4.setIsActive(true);
                movieRepository.save(movie4);

                Movie movie5 = new Movie();
                movie5.setTitle("Jurassic World Rebirth");
                movie5.setDescription("A new era of dinosaurs begins.");
                movie5.setRating(0.0);
                movie5.setImageUrl("https://image.tmdb.org/t/p/w500/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg");
                movie5.setDuration(145);
                movie5.setGenre("Action, Sci-Fi");
                movie5.setYear(2025);
                movie5.setReleaseDate(java.time.LocalDate.of(2025, 9, 5));
                movie5.setIsActive(true);
                movieRepository.save(movie5);

                System.out.println("Initial movies created!");
            } else {
                // Retrieve existing movies if they're already seeded
                movie1 = movieRepository.findAll().get(0);
                movie2 = movieRepository.findAll().get(1);
                movie3 = movieRepository.findAll().get(2);
            }

            // Seed initial theaters
            if (theaterRepository.count() == 0) {
                Theater theater1 = new Theater();
                theater1.setName("Mingalar Cinema");
                theater1.setLocation("Ga Mone Pwint");
                theater1.setTotalSeats(150);
                theaterRepository.save(theater1);

                Theater theater2 = new Theater();
                theater2.setName("Mingalar Cinema");
                theater2.setLocation("Su Lay");
                theater2.setTotalSeats(200);
                theaterRepository.save(theater2);

                Theater theater3 = new Theater();
                theater3.setName("J Cineplex");
                theater3.setLocation("Junction Square");
                theater3.setTotalSeats(120);
                theaterRepository.save(theater3);

                System.out.println("Initial theaters created!");
            }

            // Seed initial casts
            if (castRepository.count() == 0) {
                // Inception casts
                Cast cast1 = new Cast();
                cast1.setName("Leonardo DiCaprio");
                cast1.setCharacterName("Cobb");
                cast1.setAvatarUrl("https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg");
                cast1.setMovie(movie1);
                castRepository.save(cast1);

                Cast cast2 = new Cast();
                cast2.setName("Joseph Gordon-Levitt");
                cast2.setCharacterName("Arthur");
                cast2.setAvatarUrl("https://image.tmdb.org/t/p/w185/5R6u6FwGpG8hK0lQ0nY1kQ3yX6z.jpg");
                cast2.setMovie(movie1);
                castRepository.save(cast2);

                Cast cast3 = new Cast();
                cast3.setName("Ellen Page");
                cast3.setCharacterName("Ariadne");
                cast3.setAvatarUrl("https://image.tmdb.org/t/p/w185/3kYQvJzC8M6qG7vR2bN9fT5eS4x.jpg");
                cast3.setMovie(movie1);
                castRepository.save(cast3);

                // The Dark Knight casts
                Cast cast4 = new Cast();
                cast4.setName("Christian Bale");
                cast4.setCharacterName("Bruce Wayne / Batman");
                cast4.setAvatarUrl("https://image.tmdb.org/t/p/w185/qC0s6YbX3F2hL5R1cZ8bP9mK4nV.jpg");
                cast4.setMovie(movie2);
                castRepository.save(cast4);

                Cast cast5 = new Cast();
                cast5.setName("Heath Ledger");
                cast5.setCharacterName("Joker");
                cast5.setAvatarUrl("https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg");
                cast5.setMovie(movie2);
                castRepository.save(cast5);

                Cast cast6 = new Cast();
                cast6.setName("Aaron Eckhart");
                cast6.setCharacterName("Harvey Dent");
                cast6.setAvatarUrl("https://image.tmdb.org/t/p/w185/8kO1Wj0hM4xYwV5zK7P9L2Q3nR.jpg");
                cast6.setMovie(movie2);
                castRepository.save(cast6);

                System.out.println("Initial casts created!");
            }

            // Seed initial trailers
            if (trailerRepository.count() == 0) {
                // Inception trailer
                Trailer trailer1 = new Trailer();
                trailer1.setTitle("Inception Official Trailer");
                trailer1.setDuration("2:28");
                trailer1.setYoutubeId("YoHD9XEInc0");
                trailer1.setThumbnailUrl("https://img.youtube.com/vi/YoHD9XEInc0/mqdefault.jpg");
                trailer1.setMovie(movie1);
                trailerRepository.save(trailer1);

                // The Dark Knight trailer
                Trailer trailer2 = new Trailer();
                trailer2.setTitle("The Dark Knight Trailer");
                trailer2.setDuration("2:33");
                trailer2.setYoutubeId("EXeTwQWrcwY");
                trailer2.setThumbnailUrl("https://img.youtube.com/vi/EXeTwQWrcwY/mqdefault.jpg");
                trailer2.setMovie(movie2);
                trailerRepository.save(trailer2);

                System.out.println("Initial trailers created!");
            }

            // Retrieve theaters
            // Seed initial showtimes
            Theater theater1 = theaterRepository.findAll().get(0);
            Theater theater2 = theaterRepository.findAll().get(1);
            Theater theater3 = theaterRepository.findAll().get(2);
            // Delete all old showtimes first to get fresh data with movieTitle
            showTimeRepository.deleteAll();
            LocalDate today = LocalDate.now();
            // Showtimes for Inception (movie1)
            ShowTime st1 = new ShowTime();
            st1.setMovie(movie1);
            st1.setTheater(theater1);
            st1.setShowDate(today);
            st1.setShowTime(LocalTime.parse("10:00", DateTimeFormatter.ofPattern("HH:mm")));
            st1.setAvailableSeats(theater1.getTotalSeats());
            showTimeRepository.save(st1);

            ShowTime st2 = new ShowTime();
            st2.setMovie(movie1);
            st2.setTheater(theater1);
            st2.setShowDate(today);
            st2.setShowTime(LocalTime.parse("14:00", DateTimeFormatter.ofPattern("HH:mm")));
            st2.setAvailableSeats(theater1.getTotalSeats());
            showTimeRepository.save(st2);

            ShowTime st3 = new ShowTime();
            st3.setMovie(movie1);
            st3.setTheater(theater2);
            st3.setShowDate(today.plusDays(1));
            st3.setShowTime(LocalTime.parse("19:00", DateTimeFormatter.ofPattern("HH:mm")));
            st3.setAvailableSeats(theater2.getTotalSeats());
            showTimeRepository.save(st3);

            // Showtimes for The Dark Knight (movie2)
            ShowTime st4 = new ShowTime();
            st4.setMovie(movie2);
            st4.setTheater(theater3);
            st4.setShowDate(today);
            st4.setShowTime(LocalTime.parse("11:00", DateTimeFormatter.ofPattern("HH:mm")));
            st4.setAvailableSeats(theater3.getTotalSeats());
            showTimeRepository.save(st4);

            ShowTime st5 = new ShowTime();
            st5.setMovie(movie2);
            st5.setTheater(theater3);
            st5.setShowDate(today.plusDays(1));
            st5.setShowTime(LocalTime.parse("15:00", DateTimeFormatter.ofPattern("HH:mm")));
            st5.setAvailableSeats(theater3.getTotalSeats());
            showTimeRepository.save(st5);

            System.out.println("Initial showtimes created!");
        };
    }

}
