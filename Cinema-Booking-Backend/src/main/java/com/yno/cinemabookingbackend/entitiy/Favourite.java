package com.yno.cinemabookingbackend.entitiy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "favourites")
public class Favourite extends IdClass{

    @ManyToOne
    private User user;
    @ManyToOne
    private Movie movie;

}
