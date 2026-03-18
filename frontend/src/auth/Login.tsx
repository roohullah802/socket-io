import React, { useCallback, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../toolkit/hooks";
import { setToken, setUser } from "../toolkit/user.reducer";
import { useLoginMutation } from "../toolkit/apiSlice";
import { connectToSocket } from "../socket/socket";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const credentials = {
        email: loginData.email,
        password: loginData.password,
      };
      const res = await login(credentials);

      const userLogin = res?.data?.data?.userLogin;
      if (userLogin?.accessToken) {
        connectToSocket(userLogin.id);
        const user = { id: userLogin.id, email: userLogin.email };

        dispatch(setUser(user));
        dispatch(setToken(userLogin.accessToken));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // dispatch(setUser(null));
  // dispatch(setToken(null));

  if (isAuthenticated) {
    return <Navigate to={"/home"} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLoading ? "Logging..." : "Login"}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-blue-500 hover:underline">
              <Link to={"/register"}>Register</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
