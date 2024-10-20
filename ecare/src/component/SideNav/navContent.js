import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentIcon from "@mui/icons-material/Payment";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import { ROUTES } from "../../router/routes";

export const NAV_CONTENT_PATIENT = [
  {
    id: 1,
    title: "Dashboard",
    link: ROUTES.PATIENT_HOME,
    icon: DashboardCustomizeRoundedIcon,
  },
  {
    id: 2,
    title: "Appointments",
    link: ROUTES.PATIENT_APPOINTMENT,
    icon: CalendarMonthIcon,
  },
  {
    id: 3,
    title: "Consultation",
    link: ROUTES.PATIENT_CONSULTATION,
    icon: VideoChatIcon,
  },
  {
    id: 4,
    title: "Bookings",
    link: ROUTES.SCHEDULED_APPOINTMENT,
    icon: EditCalendarIcon,
  },
  {
    id: 5,
    title: "Payments",
    link: ROUTES.PATIENT_PAYMENTS,
    icon: PaymentIcon,
  },
  {
    id: 6,
    title: "Records",
    link: ROUTES.PATIENT_RECORDS,
    icon: LibraryBooksIcon,
  },
];

export const NAV_CONTENT_ADMIN = [
  {
    id: 1,
    title: "Dashboard",
    link: ROUTES.ADMIN_HOME,
    icon: DashboardCustomizeRoundedIcon,
  },
  {
    id: 2,
    title: "Doctors",
    link: ROUTES.ADMIN_DOC_LIST,
    icon: BadgeRoundedIcon,
  },
  {
    id: 3,
    title: "Patients",
    link: ROUTES.ADMIN_PATIENT_LIST,
    icon: PeopleRoundedIcon,
  },
  {
    id: 4,
    title: "Care Coordinator",
    link: ROUTES.ADMIN_COORDINATOR_LIST,
    icon: PeopleRoundedIcon,
  },
  {
    id: 5,
    title: "Appointments",
    link: ROUTES.ADMIN_APPOINTMENTS,
    icon: CalendarMonthIcon,
  },
  {
    id: 6,
    title: "Leave",
    link: ROUTES.ADMIN_LEAVE,
    icon: EditCalendarIcon,
  },
];

export const NAV_CONTENT_DOCTOR = [
  {
    id: 1,
    title: "Dashboard",
    link: ROUTES.DEFAULT_HOME,
    icon: DashboardCustomizeRoundedIcon,
  },
  {
    id: 2,
    title: "Appointments",
    link: ROUTES.SCHEDULED_APPOINTMENTS,
    icon: CalendarMonthIcon,
  },
  {
    id: 3,
    title: "Patients",
    link: ROUTES.DOCTOR_PATIENTLIST,
    icon: PeopleRoundedIcon,
  },
  {
    id: 4,
    title: "Leave Appilication",
    link: ROUTES.DOCTOR_LEAVE,
    icon: EditCalendarIcon,
  },
];

export const NAV_CONTENT_COORDINATOR = [
  {
    id: 1,
    title: "Dashboard",
    link: ROUTES.PATIENT_HOME,
    icon: DashboardCustomizeRoundedIcon,
  },

  {
    id: 2,
    title: "Records",
    link: ROUTES.HEALTH_RECORDS,
    icon: AutoStoriesIcon,
  },
];
