import { Alert, Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import StatCard from "../../Components/Common/StatCard";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import DashboardPanel from "../../Components/Dashboard/DashboardPanel";
import RecentRequestsList from "../../Components/Dashboard/RecentRequestsList";
import { useFetch } from "../../Hooks/useFetch";
import { useAuthContext } from "../../Context/AuthContext";
import { getDashboard } from "../../api/dashboardApi";

function AgronomistDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const { data, loading, error, refetch } = useFetch(() => getDashboard("agronomist"), []);

  if (loading) {
    return <LoadingState message="Loading your workspace..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const { requests, performance, feedback, specialties, work_queue, recently_processed } = data.dashboard;
  const goTo = (status) => navigate(`/agronomist/requests${status ? `?status=${status}` : ""}`);

  return (
    <>
      <PageHeader
        title={`Hello, ${currentUser?.name ?? ""}`}
        subtitle="Your assigned consultations and what needs your attention."
        actions={
          <Button component={Link} to="/agronomist/requests" variant="contained">
            Open my requests
          </Button>
        }
      />

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", alignItems: "center" }} useFlexGap>
        <Typography color="text.secondary" fontWeight={600}>
          Specialties:
        </Typography>
        {specialties.length === 0 ? (
          <Typography color="text.secondary">None yet — ask the admin to add your specialties.</Typography>
        ) : (
          specialties.map((specialty) => <Chip key={specialty.id} label={specialty.name} color="primary" variant="outlined" />)
        )}
      </Stack>

      {feedback.pending_to_review > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 3 }}
          action={
            <Button component={Link} to="/agronomist/feedback" color="inherit" size="small">
              Review
            </Button>
          }
        >
          {feedback.pending_to_review} review{feedback.pending_to_review > 1 ? "s are" : " is"} waiting for your approval.
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="New assignments"
            value={requests.assigned}
            icon={<AssignmentIndOutlinedIcon />}
            color="info.main"
            onClick={() => goTo("assigned")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="In progress"
            value={requests.in_progress}
            icon={<EngineeringOutlinedIcon />}
            color="warning.main"
            onClick={() => goTo("in_progress")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Answered"
            value={requests.answered + requests.closed}
            helper={`${performance.answered_last_7_days} in the last 7 days`}
            icon={<TaskAltOutlinedIcon />}
            color="success.main"
            onClick={() => goTo("answered,closed")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Avg. response time"
            value={performance.average_response_hours ? `${performance.average_response_hours}h` : "—"}
            helper={feedback.my_consultations_rating ? `Farmer rating ${feedback.my_consultations_rating} / 5` : "No ratings yet"}
            icon={<TimerOutlinedIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <DashboardPanel title="Work queue" actionLabel="View all" actionTo="/agronomist/requests?status=assigned,in_progress">
            <Box>
              <RecentRequestsList
                requests={work_queue}
                basePath="/agronomist/requests"
                showFarmer
                emptyText="Nothing waiting for you. New assignments will appear here."
              />
            </Box>
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <DashboardPanel title="Recently processed">
            <RecentRequestsList
              requests={recently_processed}
              basePath="/agronomist/requests"
              showFarmer
              emptyText="Requests you answer or reject will appear here."
            />
          </DashboardPanel>
        </Grid>
      </Grid>
    </>
  );
}

export default AgronomistDashboard;
