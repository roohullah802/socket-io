import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./auth/Login";
import RegisterPage from "./auth/Register";
import { useLayoutEffect } from "react";
import { useMeQuery } from "./toolkit/apiSlice";
import { useAppDispatch } from "./toolkit/hooks";
import { setUser } from "./toolkit/user.reducer";
import SecureRoute from "./providers/SecureRoute";
import CreateGroup from "./components/CreateGroup";

function App() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useMeQuery(null);
  useLayoutEffect(() => {
    dispatch(setUser(data?.data?.me));
  }, [data, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <SecureRoute>
              <Home />
            </SecureRoute>
          }
        />
        <Route
          path="/home"
          element={
            <SecureRoute>
              <Home />
            </SecureRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/create-group"
          element={
            <SecureRoute>
              <CreateGroup />
            </SecureRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
