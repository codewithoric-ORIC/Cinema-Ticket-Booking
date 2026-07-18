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
@Table(name = "trailers")
public class Trailer extends IdClass {

    @Column(nullable = false)
    private String title;
    private String duration;

    @Column(name = "youtube_id", nullable = false)
    private String youtubeId;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

}
