package com.yno.cinemabookingbackend.dto.request;

import lombok.Data;

@Data
public class CreateTrailerRequest {
    private String title;
    private String duration;
    private String youtubeId;
    private String thumbnailUrl;
    private Long movieId;
}
