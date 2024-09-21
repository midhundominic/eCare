import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentIcon from "@mui/icons-material/Payment";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

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
    link: ROUTES.PATIENT_HOME,
    icon: VideoChatIcon,
  },
  {
    id: 4,
    title: "Records",
    link: ROUTES.PATIENT_HOME,
    icon: LibraryBooksIcon,
  },
  {
    id: 5,
    title: "Payments",
    link: ROUTES.PATIENT_HOME,
    icon: PaymentIcon,
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
    id:4,
    title:"Care Coordinator",
    link: ROUTES.ADMIN_COORDINATOR_LIST,
    icon: PeopleRoundedIcon,
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
    link: ROUTES.ADMIN_DOC_LIST,
    icon: BadgeRoundedIcon,
  },
  {
    id: 3,
    title: "Patients",
    link: ROUTES.DOCTOR_REGISTER,
    icon: PeopleRoundedIcon,
  },
];

export const NAV_CONTENT_COORDINATOR = [
  {
    id: 1,
    title: "Dashboard",
    link: ROUTES.DEFAULT_HOME,
    icon: DashboardCustomizeRoundedIcon,
  },
 
  {
    id: 2,
    title: "Patients",
    link: ROUTES.DOCTOR_REGISTER,
    icon: PeopleRoundedIcon,
  },
];

