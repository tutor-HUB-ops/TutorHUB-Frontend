import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from './Landing/Landing';
import Signup from "./LoginSignUp/Signup";
import Login from "./LoginSignUp/Login";
import Dashboard from "./Dashboard/Dashboard";
import TeacherDashboard from "./TeacherDashboard/TeacherDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import { UserContextProvider } from "./UserContext";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import this

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacherdashboard"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
