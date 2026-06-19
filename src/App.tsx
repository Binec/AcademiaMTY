import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ExamRoute from "./components/ExamRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import Servicios from "./pages/Servicios";
import Galeria from "./pages/Galeria";
import Contacto from "./pages/Contacto";
import Cursos from "./pages/Cursos";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Examenes from "./pages/Examenes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
          <Route path="/gracias/:courseId" element={<ThankYou />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/examenes" element={<Examenes />} />
          <Route
            path="/examen/:level"
            element={
              <ProtectedRoute>
                <ExamRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/:userId"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
