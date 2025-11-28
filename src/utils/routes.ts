import { createBrowserRouter } from "react-router";
import MainLayout from "../components/MainLayout";
import DashboardHome from "../components/DashboardHome";
import BookingsTab from "../components/BookingsTab";
import PaymentMilestonesTab from "../components/PaymentMilestonesTab";
import PaymentsTab from "../components/PaymentsTab";
import ComplaintsTab from "../components/ComplaintsTab";
import BookingDetails from "../pages/BookingDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "home", Component: DashboardHome },
      { path: "bookings", Component: BookingsTab },
      { path: "bookings/:bookingId", Component: BookingDetails },
      { path: "milestones", Component: PaymentMilestonesTab },
      { path: "payments", Component: PaymentsTab },
      { path: "complaints", Component: ComplaintsTab },
    ],
  },
]);
