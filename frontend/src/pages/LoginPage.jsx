import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    // Fill viewport and center card vertically + horizontally
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0b0b]">
      {/* Card container: responsive two-column layout, constrained width */}
      <div className="w-full max-w-6xl mx-4">
        <BorderAnimatedContainer>
          {/* Grid makes left (form) and right (illustration) equal height */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="flex items-center justify-center md:border-r border-[#2b2b2b] bg-[#111111]/70 backdrop-blur-sm p-6 md:p-12">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-6 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 size-14 rounded-full blur-2xl bg-amber-500/20" />
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-amber-400 mb-3 drop-shadow-[0_8px_24px_rgba(245,158,11,0.45)]" />
                  <h2 className="auth-heading mb-1">BuzzChat</h2>
                  <h3 className="text-lg font-semibold text-amber-200">Welcome Back</h3>
                  <p className="text-[#d1d1d1]/90 mt-1">Login to access your account</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="naveen@gmail.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {/* SIGNUP LINK */}
                <div className="text-center mt-4">
                  <Link to="/signup" className="auth-link">
                    Don’t have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:flex items-center justify-center p-6 bg-gradient-to-bl from-[#1a1a1a] to-transparent">
              <div className="w-full max-w-md flex flex-col items-center justify-center">
                <img
                  src="/login.png"
                  alt="BuzzChat login illustration"
                  className="w-full h-auto object-contain max-h-[70vh]"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-amber-400">
                    Connect Anytime, Anywhere
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Secure</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default LoginPage;
