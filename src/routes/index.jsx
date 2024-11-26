//import react router dom
import { Routes, Route, Navigate } from "react-router-dom";

//import store
import { useStore } from "../stores/user.js";

//import view login
import Login from "../views/auth/login.jsx";
import Dashboard from "../views/dashboard/Index.jsx";
import CategoriesIndex from "../views/categories/index.jsx";
import ProductsIndex from "../views/products/index.jsx";
import CustomersIndex from "../views/customers/index.jsx";
import UsersIndex from "../views/users/index.jsx";
import TransactionsIndex from "../views/transactions/index.jsx";
import Print from "../views/transactions/print/Print.jsx";


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

      {/* route "/customers" */}
      <Route path="/customers" element={
        token ? <CustomersIndex /> : <Navigate to="/" replace />
      } />

      {/* route "/users" */}
      <Route path="/users" element={
        token ? <UsersIndex /> : <Navigate to="/" replace />
      } />

      {/* route "/transactions" */}
      <Route path="/transactions" element={
        token ? <TransactionsIndex /> : <Navigate to="/" replace />
      } />

      {/* route "/transactions/print" */}
      <Route path="/transactions/print" element={
        token ? <Print /> : <Navigate to="/" replace />
      } />
    </Routes>
  );
}
