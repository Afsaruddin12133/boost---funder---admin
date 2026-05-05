import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import FeaturedDeals from "./pages/FeaturedDeals";

import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import UserPlans from "./pages/UserPlans";
import Users from "./pages/Users";
import Verification from "./pages/Verification";
import VerificationReview from "./pages/VerificationReview";



function App() {



  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0b120e",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />
        <Route
          path="/user-plans"
          element={
            <AdminLayout>
              <UserPlans />
            </AdminLayout>
          }
        />

        <Route
          path="/deals"
          element={
            <AdminLayout>
              <Deals />
            </AdminLayout>
          }
        />
        <Route
          path="/verification"
          element={
            <AdminLayout>
              <Verification />
            </AdminLayout>
          }
        />
        <Route
          path="/verification/:id"
          element={
            <AdminLayout>
              <VerificationReview />
            </AdminLayout>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <AdminLayout>
              <Subscriptions />
            </AdminLayout>
          }
        />
        <Route
          path="/featured-deals"
          element={
            <AdminLayout>
              <FeaturedDeals />
            </AdminLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <AdminLayout>
              <Notifications />
            </AdminLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
