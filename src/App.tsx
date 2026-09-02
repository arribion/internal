import {Route, Routes} from 'react-router-dom'
import Overview from './pages/Overview'
import DashboardLayout from './layouts/DashboardLayout'
import ProjectsPage from './pages/projects/ProjectsPage'
import BlogList from './pages/blogs/BlogList'
import Schedule from './pages/Schedule'
import ProjectEditor from './pages/projects/ProjectEditor'
import BlogEditor from './pages/blogs/BlogEditor'
import Contact from './pages/Contact'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'
import Team from './pages/Team'
import Login from './pages/auth/Login'
import ProtectedRoute from "./pages/auth/ProtectedPage";

const App = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
        
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path="" element={<Overview />} />
        <Route path="dashboard" element={<Overview />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectEditor />} />
        <Route path="projects/:id/edit" element={<ProjectEditor />} />
        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/new" element={<BlogEditor />} />
        <Route path="blogs/:id" />
        <Route path="schedule" element={<Schedule />} />
        <Route path="team" element={<Team />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="contact" element={<Contact />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App