package com.yno.cinemabookingbackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CastResponse {
    private Long id;
    private String name;
    private String characterName;
    private String avatarUrl;
    private Long movieId;
    private String movieTitle;
}
