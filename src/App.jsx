import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import FeaturedDeals from "./pages/FeaturedDeals";
import Founders from "./pages/Founders";
import Investors from "./pages/Investors";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import Users from "./pages/Users";
import Verification from "./pages/Verification";
// import { signInWithPopup, GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";

// import { auth } from "./firebase";


function App() {
  // const login = async () => {
  //   const provider = new GoogleAuthProvider();

  //   const result = await signInWithPopup(auth, provider);

  //   const token = await result.user.getIdToken();
  //   console.log(token);
  // };

  // const loginWithFacebook = async () => {
  //   try {
  //     const provider = new FacebookAuthProvider();

  //     const result = await signInWithPopup(auth, provider);

  //     const token = await result.user.getIdToken();
  //     console.log("FACEBOOK TOKEN:", token);
  //   } catch (error) {
  //     console.error("Facebook Login Error:", error.message);
  //   }
  // };
  // <div>
  //       <button
  //         onClick={login}
  //         className="bg-green-600 border text-white p-8 cursor-pointer"
  //       >
  //         GoogleLogin
  //       </button>
  //       <button
  //         onClick={loginWithFacebook}
  //         className="bg-blue-600 border text-white p-8 cursor-pointer"
  //       >
  //         Facebook Login
  //       </button>
  //     </div>

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0b1b0f",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.12)",
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
          path="/founders"
          element={
            <AdminLayout>
              <Founders />
            </AdminLayout>
          }
        />
        <Route
          path="/investors"
          element={
            <AdminLayout>
              <Investors />
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
