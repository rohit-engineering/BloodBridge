// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Donors from "./pages/Donors";
import Prospects from "./pages/Prospects";
import Menu from "./components/Menu";
import Prospect from "./pages/Prospect";
import Donor from "./pages/Donor";
import NewDonor from "./pages/NewDonor";
import { useSelector } from "react-redux";
import Emergency from "./pages/Emergency";
import AdminEmergencies from "./pages/AdminEmergencies";

function App() {
  const user = useSelector((state) => state.user);
  const Layout = () => {
    return (
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Menu />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/emergency",
      element: <Emergency />,
    },
    {
      path: "/request-blood",
      element: <Emergency initialTab="create" />,
    },
    {
      path: "/admin",
      element: user.currentUser ? <Layout /> : <Navigate to="/login" />,
      children: [
        {
          path: "/admin",
          element: <Admin />,
        },
        {
          path: "/admin/donors",
          element: <Donors />,
        },
        {
          path: "/admin/prospects",
          element: <Prospects />,
        },
        {
          path: "/admin/emergencies",
          element: <AdminEmergencies />,
        },
        {
          path: "/admin/prospect/:id",
          element: <Prospect />,
        },
        {
          path: "/admin/newdonor",
          element: <NewDonor />,
        },
        {
          path: "/admin/donor/:id",
          element: <Donor />,
        },
      ],
    },
  ], {
    future: {
      v7_relativeSplatPath: true,
    },
  });
  return (
    <>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </>
  );
}

export default App;
