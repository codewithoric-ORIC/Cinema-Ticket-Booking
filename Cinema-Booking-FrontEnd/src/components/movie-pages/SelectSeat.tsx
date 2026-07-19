import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoArrowBack, IoTimeOutline, IoCalendarOutline, IoCheckmarkCircle, IoLocationOutline, IoTicket } from "react-icons/io5";
import { getSoldSeatsForShow, type APISeat } from "../../service/BookingService";
import { fetchMovieById, fetchShowtimesByMovieId, type Movie, type Showtime, type Theater } from "../../service/MovieService";

function SelectSeat() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const movieDate = location.state?.date || "1 Jul";
    const movieDay = location.state?.day || "Wed";
    const showtime = location.state?.showtime;
    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);

    const seatsPerRow = 9;
    const [soldSeats, setSoldSeats] = useState<string[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [seatsData, setSeatsData] = useState<APISeat[]>([]);

    // Generate dates for next 7 days
    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                id: i + 1,
                day: days[date.getDay()],
                date: `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`,
                fullDate: date.toISOString().split('T')[0]
            });
        }
        return dates;
    };

    const AVAILABLE_DATES = generateAvailableDates();

    // Get unique theaters from showtimes
    const availableTheaters = () => {
        const uniqueTheaters = new Map<number, Theater>();
        showtimes.forEach(st => {
            if (!uniqueTheaters.has(st.theater.id)) {
                uniqueTheaters.set(st.theater.id, st.theater);
            }
        });
        return Array.from(uniqueTheaters.values());
    };

    // Get unique dates from showtimes (filtered by theater if selected)
    const availableDatesFromShowtimes = () => {
        const uniqueDates = new Set<string>();
        const filteredShowtimes = selectedTheater 
            ? showtimes.filter(st => st.theater.id === selectedTheater.id) 
            : showtimes;
        filteredShowtimes.forEach(st => uniqueDates.add(st.showDate));
        return AVAILABLE_DATES.filter(d => uniqueDates.has(d.fullDate));
    };

    // Get showtimes (filtered by theater and date if selected)
    const getShowtimes = () => {
        let filteredShowtimes = showtimes;
        if (selectedTheater) {
            filteredShowtimes = filteredShowtimes.filter(st => st.theater.id === selectedTheater.id);
        }
        if (selectedDate) {
            filteredShowtimes = filteredShowtimes.filter(st => st.showDate === selectedDate);
        }
        return filteredShowtimes;
    };

    const loadSeatsForShowtime = async (showTimeId: number) => {
        try {
            const seats = await getSoldSeatsForShow(showTimeId);
            setSeatsData(seats);
            const soldSeatNumbers = seats
                .filter(seat => seat.isBooked)
                .map(seat => `${seat.rowChar}${seat.col}`);
            setSoldSeats(soldSeatNumbers);
        } catch (e) {
            console.error("Failed to load seats", e);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (id) {
                    const movieData = await fetchMovieById(Number(id));
                    setMovie(movieData);
                    
                    const showtimesData = await fetchShowtimesByMovieId(Number(id));
                    setShowtimes(showtimesData);
                }
                if (showtime?.id) {
                    await loadSeatsForShowtime(showtime.id);
                    setSelectedShowtime(showtime);
                    setSelectedTheater(showtime.theater);
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, showtime?.id]);

    useEffect(() => {
        if (selectedShowtime?.id) {
            loadSeatsForShowtime(selectedShowtime.id);
        }
    }, [selectedShowtime?.id]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSeatClick = (seatId: string) => {
        if (soldSeats.includes(seatId)) return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBooking = () => {
        if (selectedShowtime) {
            const bookedDate = AVAILABLE_DATES.find(d => d.fullDate === selectedShowtime.showDate);
            if (bookedDate) {
                setSelectedShowtime(selectedShowtime);
                if (selectedShowtime.id) {
                    getSoldSeatsForShow(selectedShowtime.id).then(seats => {
                        const soldSeatNumbers = seats.map((seat: any) => `${seat.rowChar}${seat.col}`);
                        setSoldSeats(soldSeatNumbers);
                        setSelectedSeats([]);
                    });
                }
            }
        }
    };

    const handleCheckout = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat to proceed!");
            return;
        }
        const currentShowtime = selectedShowtime || showtime;
        const currentDate = selectedDate ? AVAILABLE_DATES.find(d => d.fullDate === selectedDate) : { date: movieDate, day: movieDay };
        const currentTheater = selectedTheater || (showtime ? showtime.theater : null);
        // Map selected seat numbers to seat ids
        const selectedSeatIds = seatsData
            .filter(seat => selectedSeats.includes(`${seat.rowChar}${seat.col}`))
            .map(seat => seat.id);
        navigate('/checkout', {
            state: {
                movie: movie,
                date: currentDate?.date || movieDate,
                day: currentDate?.day || movieDay,
                showtime: currentShowtime,
                theater: currentTheater,
                seats: selectedSeats,
                seatIds: selectedSeatIds,
                totalPrice: selectedSeats.length * 5000
            }
        });
    };

    const isBookingEnabled = selectedTheater && selectedDate && selectedShowtime;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white/40 backdrop-blur-2xl">
                <p className="text-slate-500 font-medium">Loading...</p>
            </div>
        );
    }

    const renderSeat = (row: string, seatNum: number) => {
        const seatId = `${row}${seatNum}`;
        const isSold = soldSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);

        return (
            <button
                key={seatId}
                disabled={isSold}
                onClick={() => handleSeatClick(seatId)}
                className={`w-8 h-8 rounded-lg text-[10px] font-black border flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xs
                    ${isSold
                    ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed shadow-none"
                    : isSelected
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-600 scale-105 shadow-md shadow-purple-600/20"
                        : "bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:text-purple-600 hover:scale-105"
                }`}
            >
                {seatId}
            </button>
        );
    };

    const renderRowSeats = (row: string) => {
        return Array.from({ length: seatsPerRow }, (_, i) => renderSeat(row, i + 1));
    };

    return (
        <div className="w-full min-h-screen bg-white/40 backdrop-blur-2xl relative overflow-x-hidden pt-28 pb-20">
            <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm mb-6 transition-colors cursor-pointer group">
                    <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"/> Back to Movie Details
                </button>

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Select Your Seats</h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="text-slate-800 font-bold">{movie?.title}</span>
                        <span className="h-3 w-[1px] bg-slate-300"></span>
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                            <IoCalendarOutline className="w-4 h-4 text-purple-600" />
                            <span>{movieDay}, {movieDate}</span>
                        </div>
                        <span className="h-3 w-[1px] bg-slate-300"></span>
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                            <IoTimeOutline className="w-4 h-4 text-purple-600" />
                            <span>{showtime?.showTime}</span>
                        </div>
                    </div>
                </div>

                {/* 🎬 Booking Section (Compact Layout) */}
                <div className="mb-8 w-full rounded-[2.5rem] p-6 md:p-8
                         bg-slate-500/[0.06] backdrop-blur-xl
                         border border-black/[0.06]
                         shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]
                         hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]
                         hover:-translate-y-1 transition-all duration-400">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Select Your Show</h3>
                    
                    {/* Theater Selection */}
                    <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2">
                            <IoLocationOutline className="w-4 h-4 text-purple-600" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Choose Theater</h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {availableTheaters().map((theater) => {
                                const isSelected = selectedTheater?.id === theater.id;
                                return (
                                    <button
                                        key={theater.id}
                                        onClick={() => {
                                            setSelectedTheater(theater);
                                            setSelectedShowtime(null);
                                            setSelectedDate("");
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 h-[70px] rounded-xl border transition-all duration-300 cursor-pointer text-center select-none
                                            ${isSelected
                                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-600 text-white shadow-md shadow-purple-600/20"
                                            : "bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50"
                                        }`}
                                    >
                                        <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                                            {theater.location}
                                        </span>
                                        <span className="text-xs font-extrabold tracking-tight mt-1 line-clamp-1">
                                            {theater.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Selection */}
                    {selectedTheater && (
                    <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2">
                            <IoCalendarOutline className="w-4 h-4 text-purple-600" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Choose Date</h4>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                            {availableDatesFromShowtimes().map((d) => {
                                const isSelected = selectedDate === d.fullDate;
                                return (
                                    <button
                                        key={d.id}
                                        onClick={() => {
                                            setSelectedDate(d.fullDate);
                                            setSelectedShowtime(null);
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 h-[60px] rounded-xl border transition-all duration-300 cursor-pointer text-center select-none
                                            ${isSelected
                                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-600 text-white shadow-md shadow-purple-600/20"
                                            : "bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50"
                                        }`}
                                    >
                                        <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                                            {d.day}
                                        </span>
                                        <span className="text-xs font-extrabold tracking-tight mt-1">
                                            {d.date}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    )}
                    
                    {/* Showtimes Section */}
                    {selectedDate && (
                    <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2">
                            <IoTimeOutline className="w-4 h-4 text-purple-600" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Choose Showtime</h4>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                            {getShowtimes().map((st) => {
                                const isSelected = selectedShowtime?.id === st.id;
                                return (
                                    <button
                                        key={st.id}
                                        onClick={() => setSelectedShowtime(st)}
                                        className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer text-center select-none
                                            ${isSelected
                                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-600 text-white shadow-md shadow-purple-600/20"
                                            : "bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50"
                                        }`}
                                    >
                                        <span className="text-sm font-bold tracking-tight">
                                            {st.showTime}
                                        </span>
                                        <span className={`text-[10px] font-medium ${isSelected ? "text-purple-200" : "text-slate-400"} mt-0.5`}>
                                            {st.theater.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    )}
                    
                    {/* Book Now Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleBooking}
                            disabled={!isBookingEnabled}
                            className="group relative h-11 w-60 rounded-xl text-sm font-bold text-white tracking-wide uppercase
                                               bg-gradient-to-r from-purple-600 to-indigo-600
                                               shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98
                                               transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-xl pointer-events-none" />
                            <IoTicket className="w-4 h-4 text-purple-200" />
                            <span>Select Showtime</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-4 md:p-6 shadow-xs flex flex-col items-center overflow-x-auto">

                        <div className="w-full max-w-[460px] mb-8 relative flex flex-col items-center">
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block mt-3">SCREEN</span>
                        </div>

                        <div className="flex flex-col gap-4 w-full items-center min-w-[600px] select-none">

                            <div className="flex flex-col gap-2 items-center w-full">
                                <div className="flex gap-1.5">{renderRowSeats("A")}</div>
                                <div className="flex gap-1.5">{renderRowSeats("B")}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 w-full justify-center">
                                <div className="flex flex-col gap-2 items-end">
                                    <div className="flex gap-1.5">{renderRowSeats("C")}</div>
                                    <div className="flex gap-1.5">{renderRowSeats("D")}</div>
                                </div>
                                <div className="flex flex-col gap-2 items-start">
                                    <div className="flex gap-1.5">{renderRowSeats("E")}</div>
                                    <div className="flex gap-1.5">{renderRowSeats("F")}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 w-full justify-center">
                                <div className="flex flex-col gap-2 items-end">
                                    <div className="flex gap-1.5">{renderRowSeats("G")}</div>
                                    <div className="flex gap-1.5">{renderRowSeats("H")}</div>
                                </div>
                                <div className="flex flex-col gap-2 items-start">
                                    <div className="flex gap-1.5">{renderRowSeats("I")}</div>
                                    <div className="flex gap-1.5">{renderRowSeats("J")}</div>
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-slate-100 w-full text-[10px] font-bold text-slate-400">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-white border border-slate-200"></div> Available</div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600"></div> Selected</div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200"></div> Sold</div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col space-y-6">

                        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-5 shadow-sm flex flex-col justify-between flex-grow min-h-[220px]">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Booking Summary</h3>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-slate-400">Selected Seats</span>
                                        <span className="font-extrabold text-slate-800 tracking-tight">
                                            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-slate-400">Total Tickets</span>
                                        <span className="font-extrabold text-slate-800">{selectedSeats.length} Tickets</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pt-2.5 border-t border-slate-200/60">
                                        <span className="font-bold text-slate-800">Total Price</span>
                                        <span className="text-sm font-black text-purple-600">{(selectedSeats.length * 5000).toLocaleString()} MMK</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="group relative h-11 w-full rounded-xl text-xs font-black text-white tracking-wider uppercase mt-6
                                               bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:scale-102 active:scale-98 transition-all duration-300 overflow-hidden flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                                <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                                <IoCheckmarkCircle className="w-4 h-4 text-purple-200" />
                                <span>Proceed to Checkout</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SelectSeat;
