import { Route, Routes, Navigate } from "react-router-dom";
import Overview from "./pages/Overview";
import DashboardLayout from "./layouts/DashboardLayout";
import ProjectsPage from "./pages/projects/ProjectsPage";
import BlogList from "./pages/blogs/BlogList";
import Schedule from "./pages/Schedule";
import ProjectEditor from "./pages/projects/ProjectEditor";
import BlogEditor from "./pages/blogs/BlogEditor";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
// import Team from "./pages/team/Team";
import Login from "./pages/auth/Login";
import ProtectedRoutes from "./pages/auth/ProtectedRoutes";
import AvailabilityPage from "./pages/schedules/AvailabilityPage";
import BookingRequestsPage from "./pages/schedules/BookingRequestsPage";
import UpcomingSessionsPage from "./pages/schedules/UpcomingSessionsPage";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={<Login />} />

      {/* Protected Layout Framework */}
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }>
        {/* 1. Add a redirect or direct landing page for the bare "/" domain */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Sub-routes under the dashboard wrapper */}
        <Route path="dashboard" element={<Overview />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectEditor />} />
        <Route path="projects/:id/edit" element={<ProjectEditor />} />
        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/new" element={<BlogEditor />} />
        <Route path="blogs/:id" />
        <Route path="schedule" element={<Schedule />}>
          <Route index element={<AvailabilityPage />} />
          <Route path="sessions" element={<UpcomingSessionsPage />} />
          <Route path="requests" element={<BookingRequestsPage />} />
        </Route>
        {/* <Route path="team" element={<Team />} /> */}
        <Route path="tasks" element={<Tasks />} />
        <Route path="contact" element={<Contact />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 2. Fallback Catch-All Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
