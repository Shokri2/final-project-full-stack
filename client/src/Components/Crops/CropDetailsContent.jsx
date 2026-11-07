import { useCallback } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import CropHero from "./CropHero";
import CropInfoGrid from "./CropInfoGrid";
import GrowthStages from "./GrowthStages";
import CropReviews from "./CropReviews";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import { useFetch } from "../../Hooks/useFetch";
import { useAuthContext } from "../../Context/AuthContext";
import { getCropDetails } from "../../api/cropsApi";

function Section({ title, subtitle, children }) {
  return (
    <Box component="section" sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight={800}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: subtitle ? 0 : 2 }}>{children}</Box>
    </Box>
  );
}

function AskAgronomistButton({ cropId }) {
  const location = useLocation();
  const { currentUser } = useAuthContext();

  if (currentUser && currentUser.role !== "user") {
    return null;
  }

  return (
    <Button
      component={Link}
      to={currentUser ? `/user/requests/new?crop_id=${cropId}` : "/login"}
      state={currentUser ? undefined : { from: location }}
      variant="contained"
      color="secondary"
      size="large"
      startIcon={<SupportAgentOutlinedIcon />}
      sx={{ fontWeight: 800, alignSelf: { xs: "stretch", md: "auto" } }}
    >
      Ask an agronomist
    </Button>
  );
}

function CropDetailsContent({ cropId, backTo, inDashboard }) {
  const fetchCrop = useCallback(() => getCropDetails(cropId).then((data) => ({ data })), [cropId]);
  const { data, loading, error, refetch } = useFetch(fetchCrop, [fetchCrop]);

  if (loading) {
    return <LoadingState message="Loading crop details..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState title="Crop not available" message={error} onRetry={refetch} />
      </Container>
    );
  }

  const crop = data.data;

  return (
    <Box>
      <CropHero
        crop={crop}
        backTo={backTo}
        action={<AskAgronomistButton cropId={crop.id} />}
        sx={inDashboard ? { mx: { xs: -2, sm: -3 }, mt: { xs: -2, sm: -3 }, width: "auto" } : undefined}
      />

      <Container maxWidth="lg" disableGutters={inDashboard} sx={{ pb: { xs: 5, md: 8 } }}>
        {crop.description && (
          <Typography sx={{ mt: 4, fontSize: 18, lineHeight: 1.8, maxWidth: 820 }} color="text.secondary">
            {crop.description}
          </Typography>
        )}

        <Section title="Growing requirements">
          <CropInfoGrid crop={crop} />
        </Section>

        <Section title="Growth stages" subtitle="What to expect from planting to harvest.">
          <GrowthStages stages={crop.growth_stages} />
        </Section>

        <Section title="Farmer reviews" subtitle="Only reviews approved by our team are shown.">
          <CropReviews cropId={crop.id} />
        </Section>
      </Container>
    </Box>
  );
}

export default CropDetailsContent;
