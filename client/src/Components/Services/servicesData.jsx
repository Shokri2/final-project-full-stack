import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

export const services = [
  {
    icon: <MenuBookOutlinedIcon />,
    title: "Crop guide",
    description: "Profiles for each crop with ideal temperature, water, sunlight, soil type and days to harvest.",
    to: "/crop-guide",
    action: "Open the guide",
  },
  {
    icon: <TimelineOutlinedIcon />,
    title: "Growth stages",
    description: "Every crop is broken into stages from planting to harvest, with the length of each stage and practical tips.",
    to: "/crop-guide",
    action: "See the stages",
  },
  {
    icon: <SupportAgentOutlinedIcon />,
    title: "Agronomist consultations",
    description: "Describe a problem with your crop and get a written answer from a certified agronomist.",
    to: "/register",
    action: "Ask an agronomist",
  },
  {
    icon: <AddAPhotoOutlinedIcon />,
    title: "Photo-based diagnosis",
    description: "Attach up to three photos of leaves, fruits or the whole plant so the agronomist can see the problem.",
    to: "/register",
    action: "Start a request",
  },
  {
    icon: <WorkspacePremiumOutlinedIcon />,
    title: "Matched specialists",
    description: "Each request is assigned to an agronomist who specialises in your crop's category, such as leafy greens or fruits.",
    to: "/smart-farming",
    action: "How it works",
  },
  {
    icon: <RateReviewOutlinedIcon />,
    title: "Tracking & verified reviews",
    description: "Follow your request from pending to answered, then rate the advice. Reviews are checked before they are published.",
    to: "/",
    action: "Read reviews",
  },
];
