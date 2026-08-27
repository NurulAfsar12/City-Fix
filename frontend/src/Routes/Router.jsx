import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/HomePage/Home/Home";
import CityMap from "../Pages/CityMap/CityMap";
import ErrorPage from "../Pages/Error/ErrorPage";
import RegistrationPage from "../Authentication/Pages/RegistrationPage/RegistrationPage";
import LogInPage from "../Authentication/Pages/LogInPage/LogInPage";
import PrivateRoute from "./PrivateRoute";

// Citizen Imports
import CitizenDashboard from "../Pages/Dashboard/CitizenDashboard/CitizenDashboard";
import WorkerDashboard from "../Pages/Dashboard/WorkerDashboard/WorkerDashboard";
import AssignedIssues from "../Pages/Dashboard/WorkerDashboard/AssignedIssues";
import WorkerOverview from "../Pages/Dashboard/WorkerDashboard/WorkerOverview";

import IssueDetails from "../Pages/IssueDetails/IssueDetails";
import AllIssues from "../Pages/AllIssues/AllIssues";
import CitizenStats from "../Pages/Dashboard/CitizenDashboard/CitizenStats";
import MyIssues from "../Pages/Dashboard/CitizenDashboard/MyIssues";
import ReportIssue from "../Pages/Dashboard/CitizenDashboard/ReportIssue";
import UserProfile from "../Pages/Dashboard/CitizenDashboard/UserProfile";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard/AdminDashboard";
import AdminOverview from "../Pages/Dashboard/AdminDashboard/AdminOverview";
import ManageStaff from "../Pages/Dashboard/AdminDashboard/ManageStaff";
import AdminAllIssues from "../Pages/Dashboard/AdminDashboard/AdminAllIssues";
import AdminProfile from "../Pages/Dashboard/AdminDashboard/AdminProfile";
import WorkerProfile from "../Pages/Dashboard/WorkerDashboard/WorkerProfile";
import TopIssues from "../Pages/TopIssues/TopIssues";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "city-map",
        Component: CityMap,
      },
      {
        path: "register",
        element: <RegistrationPage />,
      },
      {
        path: "top-issues",
        element: <TopIssues />,
      },
      {
        path: "login",
        element: <LogInPage />,
      },
      {
        path: "dashboard/citizen",
        element: (
          <PrivateRoute>
            <CitizenDashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <CitizenStats />,
          },
          {
            path: "my-issues",
            element: <MyIssues />,
          },
          {
            path: "report-issue",
            element: <ReportIssue />,
          },
          {
            path: "profile",
            element: <UserProfile />,
          },
        ],
      },
      {
        path: "dashboard/admin",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminOverview />,
          },
          {
            path: "manage-staff",
            element: <ManageStaff />,
          },
          {
            path: "all-issues",
            element: <AdminAllIssues />,
          },
          {
            path: "profile",
            element: <AdminProfile />,
          },
        ],
      },
      {
        path: "dashboard/worker",
        element: (
          <PrivateRoute>
            <WorkerDashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <WorkerOverview />,
          },
          {
            path: "assigned-issues",
            element: <AssignedIssues />,
          },
          {
            path: "profile",
            element: <WorkerProfile />,
          },
        ],
      },
      {
        path: "issue-details/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "all-issues",
        Component: AllIssues,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
