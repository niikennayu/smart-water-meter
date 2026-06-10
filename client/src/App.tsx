import { Routes, Route } from "react-router-dom"

//Landing
import LandingPage from "./pages/landing/LandingPage"

// USER
import Login from "./pages/user/Login"
import Home from "./pages/user/Home"
import BayarTagihan from "./pages/user/BayarTagihan"
import MetodePembayaran from "./pages/user/MetodePembayaran"
import Payment from "./pages/user/Payment"
import PaymentSuccess from "./pages/user/PaymentSuccess"
import Register from "./pages/user/Register"
import ActivateAccount from "./components/ActivateAccount"
import ProtectedRoute from "./components/ProtectRoute";
import ForgotPassword from "./pages/user/ForgotPassword"
import ResetPassword from "./pages/user/ResetPassword";

// ADMIN
import Dashboard from "./pages/admin/Dashbord"
import AdminLayout from "./layouts/AdminLayout"
import Monitoring from "./pages/admin/Monitoring"
import Billing from "./pages/admin/Billing"

export default function App() {
  return (
    <Routes>

      <Route path="/landing" element={<LandingPage />} />

      {/* USER */}
    <Route path="/register" element={<Register />} />
     <Route path="/" element={<Login />} />
<Route
  path="/activate-account"
  element={<ActivateAccount />}
/>
      <Route path="/login" element={<Login />} />
      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route
  path="/reset-password"
  element={<ResetPassword />}
/>
      <Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
      <Route path="/bayar-tagihan" element={<BayarTagihan />} />
      <Route path="/metode-pembayaran" element={<MetodePembayaran />} />
      <Route path="/qris-payment" element={<Payment />} />
      <Route
  path="/payment-success"
  element={<PaymentSuccess />}
/>
      {/* ADMIN */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="billing" element={<Billing />} />

      </Route>

    </Routes>
  )
}