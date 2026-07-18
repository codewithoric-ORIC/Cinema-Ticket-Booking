package com.yno.cinemabookingbackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCastRequest {
    private String name;
    private String characterName;
    private String avatarUrl;
    private Long movieId;
}
