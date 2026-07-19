import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  IoArrowBack,
  IoPerson,
  IoMail,
  IoCall,
  IoCard,
  IoCheckmarkCircle,
  IoTicket,
  IoTimeOutline,
  IoCalendarOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { isLoggedIn, getLogeedInUsername } from "../auth/service/AuthService";
import { saveBooking, saveAPIBooking } from "../service/BookingService.tsx";

function Checkout() {
  const location = useLocation();
  const { movie, date, day, showtime, theater, seats, seatIds, totalPrice } =
    location.state || {};
  const time = showtime?.showTime;

  // Test payment data
  const TEST_DATA = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+95 9 123 4567",
    cardNumber: "4111 1111 1111 1111",
    cardExpiry: "12/28",
    cardCvv: "123",
  };

  const [formData, setFormData] = useState({
    name: isLoggedIn() ? (getLogeedInUsername() || TEST_DATA.name) : TEST_DATA.name,
    email: TEST_DATA.email,
    phone: TEST_DATA.phone,
    cardNumber: TEST_DATA.cardNumber,
    cardExpiry: TEST_DATA.cardExpiry,
    cardCvv: TEST_DATA.cardCvv,
    saveCard: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, type, checked } = e.target;

    // Auto-formatting
    if (name === "cardNumber") {
      // Remove all non-digit characters
      value = value.replace(/\s/g, "").replace(/[^0-9]/g, "");
      // Add space every 4 characters
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      value = value.trim();
    } else if (name === "cardExpiry") {
      // Remove all non-digit characters
      value = value.replace(/[^0-9]/g, "");
      // Add slash after 2 digits
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
    } else if (name === "cardCvv") {
      // Only allow digits, max 3
      value = value.replace(/[^0-9]/g, "").slice(0, 3);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsProcessing(true);
        console.log("=== handlePayment called!");
        console.log("Token in sessionStorage:", sessionStorage.getItem('token'));
        console.log("User in sessionStorage:", sessionStorage.getItem('user'));
        console.log("showtime?.id:", showtime?.id);
        console.log("seatIds:", seatIds);
        console.log("seatIds?.length:", seatIds?.length);
        console.log("isLoggedIn():", isLoggedIn());

    try {
      // First save to backend if we have showtime id and seat ids
      if (showtime?.id && seatIds && seatIds.length > 0 && isLoggedIn()) {
        console.log("Calling saveAPIBooking...");
        await saveAPIBooking(showtime.id, seatIds, totalPrice);
        console.log("saveAPIBooking completed!");
      }
      // Also save to localStorage for MyBookings page
      if (movie && date && day && time && theater && seats && totalPrice) {
        saveBooking({
          movie: movie,
          date: date,
          day: day,
          time: time,
          theater: theater,
          seats: seats,
          totalPrice: totalPrice,
        });
      }
      setPaymentSuccess(true);
    } catch (error) {
      console.error("Failed to save booking", error);
      alert("Failed to complete booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!movie) {
    return (
      <div className=" w-full min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            No Booking Selected!
          </h2>
          <Link
            to="/movies"
            className=" text-purple-600 font-bold hover:underline"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="w-full rounded-[2.5rem] bg-white/40 backdrop-blur-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <IoCheckmarkCircle className="w-12 h-12 text-white"></IoCheckmarkCircle>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
              Payment Successful!
            </h1>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Your tickets have been booked successfully! 🎉
            </p>

            {/* Ticket Summary */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-8 mx-auto max-w-md">
              <div className="flex items-center justify-center gap-3 mb-6">
                <IoTicket className="w-8 h-8 text-purple-600"></IoTicket>
                <h2 className="text-xl font-bold text-slate-800">
                  Booking Details
                </h2>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-semibold">Movie</span>
                  <span className="text-slate-800 font-bold">{movie.title}</span>
                </div>
                {theater && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-semibold">Theater</span>
                    <span className="text-slate-800 font-bold">
                      {theater.name}, {theater.location}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-semibold">Date</span>
                  <span className="text-slate-800 font-bold">
                    {day}, {date}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-semibold">Time</span>
                  <span className="text-slate-800 font-bold">{time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-semibold">Seats</span>
                  <span className="text-slate-800 font-bold">
                    {seats.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Total</span>
                  <span className="text-purple-600 font-black text-lg">
                    {totalPrice.toLocaleString()} MMK
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/bookings"
                className="group relative inline-flex items-center justify-center h-12 px-8 rounded-full text-sm font-bold text-white
                                           bg-gradient-to-r from-green-500 to-emerald-600
                                           shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                           hover:scale-105 hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)]
                                           active:scale-98
                                           transition-all duration-300 ease-out overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <IoTicket className="w-4 h-4"></IoTicket>
                  My Bookings
                </span>
              </Link>
              <Link
                to="/"
                className="group relative inline-flex items-center justify-center h-12 px-8 rounded-full text-sm font-bold text-slate-700
                                           bg-white border border-slate-200
                                           hover:scale-105
                                           active:scale-98
                                           transition-all duration-300 ease-out overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center">Back to Home</span>
              </Link>
              <Link
                to="/movies"
                className="group relative inline-flex items-center justify-center h-12 px-8 rounded-full text-sm font-bold text-white
                                           bg-gradient-to-r from-purple-600 to-indigo-600
                                           shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                           hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                           active:scale-98
                                           transition-all duration-300 ease-out overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                <span className="relative z-10 flex items-center justify-center">Book More Tickets</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={-1 as any}
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm transition-colors cursor-pointer group"
          >
            <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"></IoArrowBack>
            <span>Back</span>
          </Link>
        </div>

        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
              Checkout
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
            Complete Your Booking
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
            Fill in your details and complete payment to confirm your tickets.
          </p>
        </div>

        {/* Test Data Info Box */}
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-[2rem] p-6 backdrop-blur-md">
          <h3 className="text-sm font-black text-purple-700 mb-3 flex items-center gap-2">
            💳 Test Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 font-semibold">Card Number:</span>
              <span className="text-slate-800 font-bold ml-2">
                {TEST_DATA.cardNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Expiry:</span>
              <span className="text-slate-800 font-bold ml-2">
                {TEST_DATA.cardExpiry}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">CVV:</span>
              <span className="text-slate-800 font-bold ml-2">
                {TEST_DATA.cardCvv}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">
                Any other data:
              </span>
              <span className="text-slate-800 font-bold ml-2">
                Already filled!
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left - Booking Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Booking Summary
              </h3>

              {/* Movie Info */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-5 mb-6">
                <h4 className="text-lg font-black text-slate-800 mb-2">
                  {movie.title}
                </h4>
                <div className="space-y-2 text-sm">
                  {theater && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <IoLocationOutline className="w-4 h-4"></IoLocationOutline>
                      <span>
                        {theater.name}, {theater.location}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-500">
                    <IoCalendarOutline className="w-4 h-4"></IoCalendarOutline>
                    <span>
                      {day}, {date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <IoTimeOutline className="w-4 h-4"></IoTimeOutline>
                    <span>{time}</span>
                  </div>
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-semibold text-slate-500">
                    Selected Seats
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {seats.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-semibold text-slate-500">
                    Total Tickets
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {seats.length} Tickets
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200/60">
                  <span className="font-bold text-lg text-slate-800">
                    Total Price
                  </span>
                  <span className="text-2xl font-black text-purple-600">
                    {totalPrice.toLocaleString()} MMK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Payment Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handlePayment}
              className="bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-6 space-y-8"
            >
              {/* Personal Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                  <IoPerson className="w-4 h-4"></IoPerson>
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">
                      Name
                    </label>
                    <div className="relative flex items-center group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="h-12 w-full pl-11 pr-4 rounded-full
                                                         bg-slate-500/[0.05] text-slate-800 placeholder-slate-400
                                                         border border-black/[0.05] backdrop-blur-md
                                                         focus:border-purple-500/40 focus:bg-white focus:outline-none
                                                         shadow-[0_2px_8px_rgba(0,0,0,0.01)]
                                                         transition-all duration-300 text-sm"
                      />
                      <IoPerson className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors"></IoPerson>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">
                      Email
                    </label>
                    <div className="relative flex items-center group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        className="h-12 w-full pl-11 pr-4 rounded-full
                                                         bg-slate-500/[0.05] text-slate-800 placeholder-slate-400
                                                         border border-black/[0.05] backdrop-blur-md
                                                         focus:border-purple-500/40 focus:bg-white focus:outline-none
                                                         shadow-[0_2px_8px_rgba(0,0,0,0.01)]
                                                         transition-all duration-300 text-sm"
                      />
                      <IoMail className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors"></IoMail>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">
                      Phone Number
                    </label>
                    <div className="relative flex items-center group">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+95 9 123 4567"
                        className="h-12 w-full pl-11 pr-4 rounded-full
                                                         bg-slate-500/[0.05] text-slate-800 placeholder-slate-400
                                                         border border-black/[0.05] backdrop-blur-md
                                                         focus:border-purple-500/40 focus:bg-white focus:outline-none
                                                         shadow-[0_2px_8px_rgba(0,0,0,0.01)]
                                                         transition-all duration-300 text-sm"
                      />
                      <IoCall className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors"></IoCall>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                  <IoCard className="w-4 h-4"></IoCard>
                  <span>Payment Details</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">
                      Card Number
                    </label>
                    <div className="relative flex items-center group">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="h-12 w-full pl-11 pr-4 rounded-full
                                                         bg-slate-500/[0.05] text-slate-800 placeholder-slate-400
                                                         border border-black/[0.05] backdrop-blur-md
                                                         focus:border-purple-500/40 focus:bg-white focus:outline-none
                                                         shadow-[0_2px_8px_rgba(0,0,0,0.01)]
                                                         transition-all duration-300 text-sm"
                      />
                      <IoCard className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors"></IoCard>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="h-12 w-full px-4 rounded-full
                                                         bg-slate-500/[0.05] text-slate-800 placeholder-slate-400
                                                         border border-black/[0.05] backdrop-blur-md
                                                         focus:border-purple-500/40 focus:bg-white focus:outline-none
                                                         shadow-[0_2px_8px_rgba(0,0,0,0.01)]
                                                         transition-all duration-300 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        required
                        placeholder="123"
                        maxLength={3}
                        className="h-12 w-full px-4 rounded-full
                                                         bg-slate-500/[0.05] text-slate-800 placeholder-slate-400
                                                         border border-black/[0.05] backdrop-blur-md
                                                         focus:border-purple-500/40 focus:bg-white focus:outline-none
                                                         shadow-[0_2px_8px_rgba(0,0,0,0.01)]
                                                         transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 my-1">
                    <input
                      type="checkbox"
                      id="saveCard"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                      className="checkbox checkbox-xs rounded-md border-slate-300 checked:border-purple-500 [--chkbg:theme(colors.purple.500)] [--chkfg:white]"
                    />
                    <label
                      htmlFor="saveCard"
                      className="text-xs font-semibold text-slate-600 select-none cursor-pointer"
                    >
                      Save card for future purchases
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="group relative h-14 w-full rounded-full text-sm font-black text-white tracking-wider uppercase
                                           bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] active:scale-98
                                           transition-all duration-300 ease-out overflow-hidden cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <IoCheckmarkCircle className="w-4 h-4 text-purple-200"></IoCheckmarkCircle>
                      <span>Pay {totalPrice.toLocaleString()} MMK</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;