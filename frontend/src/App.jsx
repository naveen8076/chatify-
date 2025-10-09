import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}

      {/* Subtle gold grid background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(255,215,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,215,0,0.05) 1px, transparent 1px)",
          backgroundSize: "14px 24px",
        }}
      />

      {/* Top-left gold glow */}
      <div className="absolute top-0 -left-6 size-96 bg-amber-500 opacity-25 blur-[120px]" />

      {/* Bottom-right rich golden glow */}
      <div className="absolute bottom-0 -right-6 size-96 bg-yellow-500 opacity-25 blur-[120px]" />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      {/* TOASTER */}
      <Toaster
        toastOptions={{
          style: {
            background: "#1c1c1c",
            color: "#f5d776",
            border: "1px solid #3b2f0b",
          },
        }}
      />
    </div>
  );
}

export default App;
