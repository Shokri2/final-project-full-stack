import { Alert, AlertTitle, Box, Button, Grid, List, ListItemButton, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import StatCard from "../../Components/Common/StatCard";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import DashboardPanel from "../../Components/Dashboard/DashboardPanel";
import RecentRequestsList from "../../Components/Dashboard/RecentRequestsList";
import RequestUpdatesFeed from "../../Components/Dashboard/RequestUpdatesFeed";
import { useFetch } from "../../Hooks/useFetch";
import { getDashboard } from "../../api/dashboardApi";

function UserDashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(() => getDashboard("user"), []);

  if (loading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const { account, requests, recent_requests, recent_activity, feedback, consultations_to_review } = data.dashboard;
  const goToRequests = (status) => navigate(`/user/requests${status ? `?status=${status}` : ""}`);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${account.name.split(" ")[0]}`}
        subtitle="Here is what is happening with your consultations."
        actions={
          <Button component={Link} to="/user/requests/new" variant="contained" startIcon={<AddIcon />}>
            New request
          </Button>
        }
      />

      {consultations_to_review.length > 0 && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
          <AlertTitle>How was your consultation?</AlertTitle>
          Your review helps other farmers.
          <List dense disablePadding sx={{ mt: 1 }}>
            {consultations_to_review.map((item) => (
              <ListItemButton key={item.id} component={Link} to={`/user/requests/${item.id}`} sx={{ borderRadius: 1 }}>
                <ListItemText primary={item.title} secondary={`${item.crop_name} · tap to leave a review`} />
              </ListItemButton>
            ))}
          </List>
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total requests" value={requests.total} icon={<AssignmentOutlinedIcon />} onClick={() => goToRequests()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Waiting"
            value={requests.pending + requests.assigned}
            helper={`${requests.pending} pending · ${requests.assigned} assigned`}
            icon={<HourglassEmptyOutlinedIcon />}
            color="warning.main"
            onClick={() => goToRequests("pending,assigned")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="In progress"
            value={requests.in_progress}
            icon={<EngineeringOutlinedIcon />}
            color="info.main"
            onClick={() => goToRequests("in_progress")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Answered"
            value={requests.answered + requests.closed}
            helper={`${requests.answered} open · ${requests.closed} closed`}
            icon={<TaskAltOutlinedIcon />}
            color="success.main"
            onClick={() => goToRequests("answered,closed")}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <DashboardPanel title="Recent requests" actionLabel="View all" actionTo="/user/requests">
            <RecentRequestsList
              requests={recent_requests}
              basePath="/user/requests"
              emptyText="You haven't submitted any requests yet. Start by asking an agronomist about your crop."
            />
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <DashboardPanel title="Latest updates">
            <RequestUpdatesFeed updates={recent_activity} basePath="/user/requests" />
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <DashboardPanel title="My feedback" actionLabel="Manage" actionTo="/user/feedback">
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
              <StatCard title="Submitted" value={feedback.total} />
              <StatCard title="Waiting for review" value={feedback.pending} color="warning.main" />
              <StatCard title="Published" value={feedback.approved} color="success.main" />
              <StatCard title="Not approved" value={feedback.rejected} color="error.main" />
            </Box>
          </DashboardPanel>
        </Grid>
      </Grid>
    </>
  );
}

export default UserDashboard;
