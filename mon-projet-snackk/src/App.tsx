// import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/auth/Login";
// import OrderPage from "./pages/OrderPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useAuth } from "./store/useAuth";
// import { useEffect } from "react";

const App = () => {
    const { loading } = useAuth();

  // useEffect(() => {
  //   fetchUser();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [fetchUser]);

  if (loading) {
    return <div>Chargement de l'application...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
         {/*<Route path="/order" element={<OrderPage />} /> */}

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirection */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
