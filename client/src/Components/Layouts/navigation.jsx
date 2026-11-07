import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlineOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const accountLinks = (base) => [
  { label: "Profile", to: `${base}/profile`, icon: <PersonOutlineIcon /> },
  { label: "Change Password", to: `${base}/change-password`, icon: <LockResetOutlinedIcon /> },
];

export const navigation = {
  user: [
    {
      title: "Main",
      links: [
        { label: "Dashboard", to: "/user/dashboard", icon: <DashboardOutlinedIcon /> },
        { label: "Crop Guide", to: "/user/crops", icon: <SpaOutlinedIcon /> },
        { label: "My Requests", to: "/user/requests", icon: <AssignmentOutlinedIcon />, end: true },
        { label: "New Request", to: "/user/requests/new", icon: <AddCircleOutlineIcon /> },
        { label: "My Feedback", to: "/user/feedback", icon: <RateReviewOutlinedIcon /> },
      ],
    },
    { title: "Account", links: accountLinks("/user") },
  ],
  agronomist: [
    {
      title: "Main",
      links: [
        { label: "Dashboard", to: "/agronomist/dashboard", icon: <DashboardOutlinedIcon /> },
        { label: "Assigned Requests", to: "/agronomist/requests", icon: <AssignmentOutlinedIcon /> },
        { label: "Feedback Review", to: "/agronomist/feedback", icon: <RateReviewOutlinedIcon /> },
      ],
    },
    { title: "Account", links: accountLinks("/agronomist") },
  ],
  admin: [
    {
      title: "Main",
      links: [
        { label: "Dashboard", to: "/admin/dashboard", icon: <DashboardOutlinedIcon /> },
        { label: "Requests", to: "/admin/requests", icon: <AssignmentOutlinedIcon /> },
        { label: "Feedback", to: "/admin/feedback", icon: <RateReviewOutlinedIcon /> },
      ],
    },
    {
      title: "Management",
      links: [
        { label: "Users", to: "/admin/users", icon: <PeopleAltOutlinedIcon /> },
        { label: "Categories", to: "/admin/categories", icon: <CategoryOutlinedIcon /> },
        { label: "Crops", to: "/admin/crops", icon: <SpaOutlinedIcon /> },
        { label: "Messages", to: "/admin/messages", icon: <MailOutlineIcon /> },
        { label: "Activity Log", to: "/admin/activities", icon: <HistoryOutlinedIcon /> },
      ],
    },
    { title: "Account", links: accountLinks("/admin") },
  ],
};
