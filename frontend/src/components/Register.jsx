import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import MusicaLogo, { MusicaWordmark } from "./MusicaLogo";
import MusicalBackground from "./MusicalBackground";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const result = await register(formData);
      if (result.success) {
        setAlert({ type: "success", message: "Account created successfully." });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setAlert({ type: "error", message: result.message || "Registration failed." });
      }
    } catch {
      setAlert({ type: "error", message: "Connection lost. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070812] px-6 py-12 overflow-hidden font-['Outfit']">
      {/* Musical and Glowing Background Effects */}
      <MusicalBackground />

      <div className="relative z-10 w-full max-w-[440px] animate-fade-up">
        {/* Navigation Link to go back */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Back to home page"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.09] text-xs font-semibold text-[#B4B2CC] hover:text-white hover:bg-white/[0.09] transition-all min-h-[44px]"
          >
            <FiArrowLeft className="text-sm text-[#FF5C93]" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/login"
            className="text-[11px] font-bold uppercase tracking-wider text-[#FF5C93] hover:text-white transition-colors"
          >
            Sign In &rarr;
          </Link>
        </div>

        {/* Main Register Card */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#0B0D1F]/90 backdrop-blur-2xl border border-white/[0.09] shadow-2xl">
          {/* Header with new Custom Logo matching reference */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6 hover:border-[#FF3D81]/40 transition-colors shadow-lg group"
            >
              <MusicaWordmark className="text-2xl" />
            </Link>
            <h2 className="text-3xl font-[900] text-white tracking-tight italic mb-2">
              Join Beats
            </h2>
            <p className="text-[#B4B2CC] text-xs font-medium tracking-widest uppercase">
              Start your high-fidelity journey
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B4B2CC]">
                  <FiUser className="group-focus-within:text-[#FF3D81] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  aria-label="Full Name"
                  className="w-full pl-11 pr-4 py-3.5 rounded-[18px] bg-white/[0.04] border border-white/[0.09] text-white placeholder-[#B4B2CC]/50 text-sm focus:outline-none focus:border-[#FF3D81] focus:bg-white/[0.08] transition-all"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B4B2CC]">
                  <FiMail className="group-focus-within:text-[#FF3D81] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  aria-label="Email Address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-[18px] bg-white/[0.04] border border-white/[0.09] text-white placeholder-[#B4B2CC]/50 text-sm focus:outline-none focus:border-[#FF3D81] focus:bg-white/[0.08] transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B4B2CC]">
                  <FiLock className="group-focus-within:text-[#FF3D81] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  aria-label="Password"
                  className="w-full pl-11 pr-4 py-3.5 rounded-[18px] bg-white/[0.04] border border-white/[0.09] text-white placeholder-[#B4B2CC]/50 text-sm focus:outline-none focus:border-[#FF3D81] focus:bg-white/[0.08] transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full py-4 text-xs font-bold tracking-widest uppercase rounded-[20px] shadow-lg shadow-[#FF3D81]/25 flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? "Creating Profile..." : "Join Beats"}</span>
              {!loading && <FiArrowRight className="text-sm" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#B4B2CC] text-xs font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-[#FF5C93] hover:text-white transition-colors font-bold ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {alert && (
          <div
            className={`mt-4 p-4 rounded-[20px] border text-center text-xs font-bold uppercase tracking-wider ${
              alert.type === 'success'
                ? 'bg-[#FF3D81]/10 border-[#FF3D81]/30 text-[#FF5C93]'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
