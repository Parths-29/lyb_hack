import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const EnergyAdvisor = lazy(() => import("@/pages/EnergyAdvisor"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const News = lazy(() => import("@/pages/News"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const Analysis = lazy(() => import("@/pages/Analysis"));
const Weather = lazy(() => import("@/pages/Weather"));
const Inventory = lazy(() => import("@/pages/Inventory"));
const IoT = lazy(() => import("@/pages/IoT"));
const Reports = lazy(() => import("@/pages/Reports"));
const ArchDemo = lazy(() => import("@/pages/ArchDemo"));

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#526258", fontFamily: "sans-serif" }}>Loading Plant X Energy Advisor…</div>}>
            <Routes>
              <Route path="/" element={<EnergyAdvisor />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
              <Route path="/article/:id" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
              <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/iot" element={<ProtectedRoute><IoT /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/arch-demo" element={<ArchDemo />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
