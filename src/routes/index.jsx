//import react router dom
import { Routes, Route, Navigate } from "react-router-dom";

//import store
import { useStore } from "../stores/user.js";

//import view login
import Login from "../views/auth/login.jsx";
import Dashboard from "../views/dashboard/Index.jsx";
import CategoriesIndex from "../views/categories/index.jsx";
import ProductsIndex from "../views/products/index.jsx";

export default function AppRoutes() {
  //destruct state "token" from store
  const { token } = useStore();

  return (
    <Routes>
      {/* route "/" */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* route "/dashboard" */}
      <Route path="/dashboard" element={
        token ? <Dashboard /> : <Navigate to="/" replace />
      } />

      {/* route "/categories" */}
      <Route path="/categories" element={
        token ? <CategoriesIndex /> : <Navigate to="/" replace />
      } />

      {/* route "/products" */}
      <Route path="/products" element={
        token ? <ProductsIndex /> : <Navigate to="/" replace />
      } />
    </Routes>
  );
}
