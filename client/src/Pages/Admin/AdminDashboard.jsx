import { Grid, List, ListItem, ListItemText, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import StatCard from "../../Components/Common/StatCard";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import DashboardPanel from "../../Components/Dashboard/DashboardPanel";
import TrendBarChart from "../../Components/Dashboard/TrendBarChart";
import StatusBreakdown from "../../Components/Dashboard/StatusBreakdown";
import ActivityFeed from "../../Components/Dashboard/ActivityFeed";
import AttentionPanel from "../../Components/Dashboard/AttentionPanel";
import WorkloadTable from "../../Components/Dashboard/WorkloadTable";
import { useFetch } from "../../Hooks/useFetch";
import { getDashboard } from "../../api/dashboardApi";

function AdminDashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(() => getDashboard("admin"), []);

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const { totals, requests, feedback, requests_trend, top_crops, agronomist_workload, recent_activities, needs_attention } =
    data.dashboard;
  const go = (path) => () => navigate(path);

  const cards = [
    { title: "Total users", value: totals.total_users, helper: `${totals.farmers} farmers · ${totals.agronomists} agronomists`, icon: <PeopleAltOutlinedIcon />, to: "/admin/users" },
    { title: "Active crops", value: totals.active_crops, helper: `${totals.total_crops} total · ${totals.total_categories} categories`, icon: <SpaOutlinedIcon />, to: "/admin/crops" },
    { title: "Total requests", value: requests.total, icon: <AssignmentOutlinedIcon />, to: "/admin/requests" },
    { title: "Pending requests", value: requests.pending, icon: <HourglassEmptyOutlinedIcon />, color: "warning.main", to: "/admin/requests?status=pending" },
    { title: "Answered / closed", value: requests.answered + requests.closed, icon: <TaskAltOutlinedIcon />, color: "success.main", to: "/admin/requests?status=answered,closed" },
    { title: "Rejected requests", value: requests.rejected, icon: <BlockOutlinedIcon />, color: "error.main", to: "/admin/requests?status=rejected" },
    { title: "Feedback", value: feedback.total, helper: `${feedback.pending} pending · avg ${feedback.average_rating ?? "–"}★`, icon: <RateReviewOutlinedIcon />, to: "/admin/feedback" },
    { title: "New users (30 days)", value: totals.new_users_30_days, helper: `${totals.unverified_users} unverified`, icon: <CategoryOutlinedIcon />, to: "/admin/users?sort=created_at&order=desc" },
  ];

  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="Live overview of users, crops, consultations and feedback." />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard title={card.title} value={card.value} helper={card.helper} icon={card.icon} color={card.color} onClick={go(card.to)} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <DashboardPanel title="Requests per day">
            <TrendBarChart data={requests_trend} />
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <DashboardPanel title="Needs attention">
            <AttentionPanel attention={needs_attention} />
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardPanel title="Requests by status">
            <StatusBreakdown counts={requests} onSelect={(status) => navigate(`/admin/requests?status=${status}`)} />
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardPanel title="Agronomist workload" actionLabel="Users" actionTo="/admin/users?role=agronomist">
            <WorkloadTable rows={agronomist_workload} />
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardPanel title="Most requested crops">
            <List dense disablePadding>
              {top_crops.map((crop, index) => (
                <ListItem key={crop.id} disableGutters secondaryAction={<Chip size="small" label={crop.requests} />}>
                  <ListItemText primary={`${index + 1}. ${crop.name}`} />
                </ListItem>
              ))}
            </List>
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 12 }}>
          <DashboardPanel title="Recent activity" actionLabel="Activity log" actionTo="/admin/activities">
            <ActivityFeed activities={recent_activities} />
          </DashboardPanel>
        </Grid>
      </Grid>
    </>
  );
}

export default AdminDashboard;
