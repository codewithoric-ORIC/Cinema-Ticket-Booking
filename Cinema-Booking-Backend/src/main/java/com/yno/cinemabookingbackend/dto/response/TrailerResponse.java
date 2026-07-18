package com.yno.cinemabookingbackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrailerResponse {
    private Long id;
    private String title;
    private String duration;
    private String youtubeId;
    private String thumbnailUrl;
    private Long movieId;
}
