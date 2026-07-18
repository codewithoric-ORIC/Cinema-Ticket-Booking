package com.yno.cinemabookingbackend.entitiy;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class BookingSeat extends IdClass{

    @ManyToOne
    private Booking booking;
    @ManyToOne
    private Seat seat;

}
