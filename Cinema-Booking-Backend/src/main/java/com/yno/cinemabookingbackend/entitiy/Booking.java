package com.yno.cinemabookingbackend.entitiy;

import com.yno.cinemabookingbackend.enumType.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "bookings")
public class Booking extends IdClass {

    @Column(nullable = false)
    private Double totalAmount;

    @Column(unique = true, length = 50)
    private String bookingReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @ManyToOne
    private User user;
    @ManyToOne
    private ShowTime showTime;

    @OneToMany(mappedBy = "booking",orphanRemoval = true)
    private List<BookingSeat> bookingSeats;



}
