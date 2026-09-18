import { Navigate, Route, Routes } from "react-router-dom";
import CallBookings from "./pages/CallBookings";
import DashboardLayout from "./layouts/DashboardLayout";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Login from "./pages/auth/Login";
import ProtectedRoutes from "./pages/auth/ProtectedRoutes";
import NewsLetters from "./pages/NewsLetters";
import Overview from "./pages/Overview";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }>
        <Route path="/overview" element={<Overview />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="call-bookings" element={<CallBookings />} />
        <Route path="newsletter" element={<NewsLetters />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
};

export default App;
