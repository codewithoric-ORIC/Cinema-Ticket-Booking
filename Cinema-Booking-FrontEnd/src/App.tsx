import Footer from "./components/Footer.tsx";
import RegisterForm from "./auth/component/RegisterForm.tsx";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import LoginForm from "./auth/component/LoginForm.tsx";
import Home from "./components/Home.tsx";
import Header from "./components/Header.tsx";
import Movies from "./components/movie-pages/Movies.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import MovieDetails from "./components/movie-pages/MovieDetails.tsx";
import SelectSeat from "./components/movie-pages/SelectSeat.tsx";
import TheaterList from "./components/theater-pages/TheaterList.tsx";
import ReleasePage from "./components/release-page/ReleasePage.tsx";
import Favourites from "./components/Favourites.tsx";
import Profile from "./components/Profile.tsx";
import Checkout from "./components/Checkout.tsx";
import MyBookings from "./components/MyBookings.tsx";
import AdminLayout from "./admin/components/AdminLayout.tsx";
import AdminDashboard from "./admin/pages/AdminDashboard.tsx";
import AdminAddShow from "./admin/pages/AdminAddShow.tsx";
import AdminListShows from "./admin/pages/AdminListShows.tsx";
import AdminListBookings from "./admin/pages/AdminListBookings.tsx";
import AdminProfile from "./admin/pages/AdminProfile.tsx";
import AdminListMovies from "./admin/pages/AdminListMovies.tsx";
import AdminAddMovie from "./admin/pages/AdminAddMovie.tsx";
import AdminListTrailers from "./admin/pages/AdminListTrailers.tsx";
import AdminAddTrailer from "./admin/pages/AdminAddTrailer.tsx";
import AdminListCasts from "./admin/pages/AdminListCasts.tsx";
import AdminAddCast from "./admin/pages/AdminAddCast.tsx";
import AdminListShowTimes from "./admin/pages/AdminListShowTimes.tsx";
import AdminAddShowTime from "./admin/pages/AdminAddShowTime.tsx";
import { isAdmin, isLoggedIn } from "./auth/service/AuthService.ts";

function App() {
  const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    if (!isAdmin()) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Non-Admin Routes (with Header and Footer) */}
          <Route path="/" element={
            <>
              <Header />
              <main className="grow">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/movies" element={
            <>
              <Header />
              <main className="grow">
                <Movies />
              </main>
              <Footer />
            </>
          } />
          <Route path="/movie/:id" element={
            <>
              <Header />
              <main className="grow">
                <MovieDetails />
              </main>
              <Footer />
            </>
          } />
          <Route path="/select-seat/:id" element={
            <>
              <Header />
              <main className="grow">
                <SelectSeat />
              </main>
              <Footer />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Header />
              <main className="grow">
                <Checkout />
              </main>
              <Footer />
            </>
          } />
          <Route path="/bookings" element={
            <>
              <Header />
              <main className="grow">
                <MyBookings />
              </main>
              <Footer />
            </>
          } />
          <Route path="/theaters" element={
            <>
              <Header />
              <main className="grow">
                <TheaterList />
              </main>
              <Footer />
            </>
          } />
          <Route path="/release" element={
            <>
              <Header />
              <main className="grow">
                <ReleasePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/login" element={
            <>
              <Header />
              <main className="grow">
                <LoginForm />
              </main>
              <Footer />
            </>
          } />
          <Route path="/register" element={
            <>
              <Header />
              <main className="grow">
                <RegisterForm />
              </main>
              <Footer />
            </>
          } />
          <Route path="/favourites" element={
            <>
              <Header />
              <main className="grow">
                <Favourites />
              </main>
              <Footer />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Header />
              <main className="grow">
                <Profile />
              </main>
              <Footer />
            </>
          } />

          {/* Admin Routes (without Header and Footer) */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="movies" element={<AdminListMovies />} />
            <Route path="movies/add" element={<AdminAddMovie />} />
            <Route path="trailers" element={<AdminListTrailers />} />
            <Route path="trailers/add" element={<AdminAddTrailer />} />
            <Route path="casts" element={<AdminListCasts />} />
            <Route path="casts/add" element={<AdminAddCast />} />
            <Route path="showtimes" element={<AdminListShowTimes />} />
            <Route path="showtimes/add" element={<AdminAddShowTime />} />
            <Route path="shows/add" element={<AdminAddShow />} />
            <Route path="shows" element={<AdminListShows />} />
            <Route path="bookings" element={<AdminListBookings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;