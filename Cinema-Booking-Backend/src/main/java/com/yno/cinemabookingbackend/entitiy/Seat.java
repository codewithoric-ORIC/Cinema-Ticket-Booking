package com.yno.cinemabookingbackend.entitiy;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@Table(name = "seats")
public class Seat extends IdClass {

    private String seatNumber;
    @Column(length = 5, nullable = false)
    private String rowChar;
    @Column(nullable = false)
    private Integer col;
    @Column(nullable = false)
    private Double price;

    @Column(name = "is_booked", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isBooked = false;

    @Column(name = "is_reserved", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isReserved = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_time_id", nullable = false)
    private ShowTime showTime;

}