import React, { useCallback, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../toolkit/apiSlice";
import { useAppSelector } from "../toolkit/hooks";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const handleChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const data = {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        };
        const user = await register(data).unwrap();
        if (!user?.errors) {
          return navigate("/login");
        }
      } catch (error) {
        console.log("something error ", error);
      }
    },
    [register, userData, navigate],
  );

  if (isAuthenticated) {
    return <Navigate to={"/home"} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full border rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="absolute right-3 top-2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLoading ? "Creating...." : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span className="text-blue-500 hover:underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
