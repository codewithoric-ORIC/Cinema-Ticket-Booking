package com.yno.cinemabookingbackend.entitiy;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "movie_casts")
public class Cast extends IdClass{

    @Column(nullable = false)
    private String name;
    @Column(name = "character_name")
    private String characterName;

    @Column(name = "avatar_url", nullable = false)
    private String avatarUrl;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

}
