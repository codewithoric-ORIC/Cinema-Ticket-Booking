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
    CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder, MovieRepository movieRepository, TheaterRepository theaterRepository, CastRepository castRepository, TrailerRepository trailerRepository, ShowTimeRepository showTimeRepository, com.yno.cinemabookingbackend.service.ShowTimeService showTimeService) {
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
        };
    }

}
