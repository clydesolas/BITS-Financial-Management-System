import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Userdashboard from "./pages/usermodule/userdashboard.jsx";
import UserOfficerRecords from "./pages/usermodule/officer.jsx";
import UserReport from "./pages/usermodule/report.jsx";
import UserProfile from "./pages/usermodule/profile.jsx";
import Moduleadmin from "./pages/dashboardmodule/moduleadmin.jsx";
import Students from "./pages/dashboardmodule/students.jsx";
import Officers from "./pages/dashboardmodule/officers.jsx";
import Expenses from "./pages/dashboardmodule/expenses.jsx"


const router = createBrowserRouter([
    // Login / index route
    {
        path: "/",
        element: <App />,
    },
    // dashboard module
    {
        path: "/moduleAdmin",
        element: <Moduleadmin />,
    },
    {
        path: "/students",
        element: <Students />,
    },
    {
        path: "/officers",
        element: <Officers />,
    },
    {
        path: "/expenses",
        element: <Expenses />,
    },
    // usermodule routes
    {
        path: "/userDashboard",
        element: <Userdashboard />,
    },
    {
        path: "/userOfficerRecords",
        element: <UserOfficerRecords />,
    },
    {
        path: "/userReport",
        element: <UserReport />,
    },
    {
        path: "/userProfile",
        element: <UserProfile />,
    },

    //adminmodule routes
]);
    

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
