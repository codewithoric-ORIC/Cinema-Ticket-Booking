package com.yno.cinemabookingbackend.entitiy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "theaters")
public class Theater extends IdClass {

    @Column(nullable = false)
    private String name;
    private String location;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @OneToMany(mappedBy = "theater",orphanRemoval = true)
    private List<ShowTime> showTimes;

}
