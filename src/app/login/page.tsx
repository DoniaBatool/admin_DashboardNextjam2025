"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx"; // Eye Icons

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle Password
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/Dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 pr-10"
                required
              />
              {/* Eye Button for Show/Hide Password */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RxEyeOpen size={20} /> : <RxEyeClosed size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


