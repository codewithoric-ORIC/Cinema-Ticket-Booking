import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoArrowBack, IoTimeOutline, IoCalendarOutline, IoCheckmarkCircle } from "react-icons/io5";
import { getSoldSeatsForShow } from "../../service/BookingService";
import { fetchMovieById } from "../../service/MovieService";
import type { Movie } from "../../service/MovieService";

function SelectSeat() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const movieDate = location.state?.date || "1 Jul";
    const movieDay = location.state?.day || "Wed";
    const showtime = location.state?.showtime;

    const seatsPerRow = 9;
    const [soldSeats, setSoldSeats] = useState<string[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (id) {
                    const movieData = await fetchMovieById(Number(id));
                    setMovie(movieData);
                }
                if (showtime?.id) {
                    const seats = await getSoldSeatsForShow(showtime.id);
                    // Convert Seat objects to seat numbers like "A1"
                    const soldSeatNumbers = seats.map((seat: any) => `${seat.rowChar}${seat.col}`);
                    setSoldSeats(soldSeatNumbers);
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

    const handleCheckout = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat to proceed!");
            return;
        }
        navigate('/checkout', {
            state: {
                movie: movie,
                date: movieDate,
                day: movieDay,
                showtime: showtime,
                seats: selectedSeats,
                totalPrice: selectedSeats.length * 5000
            }
        });
    };

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
