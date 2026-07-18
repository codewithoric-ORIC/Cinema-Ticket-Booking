// /Users/mac/Documents/React/Cinema Booking/Cinema-Booking-FrontEnd/src/admin/service/AdminTypes.ts
export interface CreateMovieRequest {
    title: string;
    description: string;
    rating: number;
    imageUrl: string;
    duration: number;
    genre: string;
    year: number;
    releaseDate: string;
}

export interface CreateTrailerRequest {
    movieId: number;
    title: string;
    duration: string;
    youtubeId: string;
    thumbnailUrl: string;
}

export interface CreateCastRequest {
    movieId: number;
    name: string;
    characterName: string;
    avatarUrl: string;
}

export interface CreateShowtimeRequest {
    movieId: number;
    theaterId: number;
    showDate: string;
    showTime: string;
    availableSeats: number;
}