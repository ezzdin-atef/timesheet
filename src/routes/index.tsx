import DashboardPage from "@/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import VacationPage from "@/pages/VacationPage";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import TimesheetPage from "../pages/TimesheetPage";

const paths = [
  {
    path: "/",
    name: "Dashbooard",
  },
  {
    path: "/timesheets",
    name: "Timesheets",
  },
  {
    path: "/projects",
    name: "Projects",
  },
  {
    path: "/vacations",
    name: "Vacations",
  },
];

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout paths={paths} />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "timesheets",
        element: <TimesheetPage />,
      },
      {
        path: "vacations",
        element: <VacationPage />,
      },
    ],
  },
]);
