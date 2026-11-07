import { Box, Button, Container, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SectionTitle from "./SectionTitle";
import CropCard from "../Crops/CropCard";
import { useFetch } from "../../Hooks/useFetch";
import { getCrops } from "../../api/cropsApi";

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
  gap: 3,
};

function CropsPreviewSection() {
  const { data, loading, error } = useFetch(
    () => getCrops({ limit: 3, sort: "growth_duration_days", order: "asc" }).then((result) => ({ data: result })),
    [],
  );
  const crops = data?.data ?? [];

  if (error || (!loading && crops.length === 0)) {
    return null;
  }

  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <SectionTitle
          overline="START SMALL"
          title="Fast crops to begin with"
          subtitle="These crops from our guide are ready to harvest the quickest, perfect for trying a smarter routine."
        />
        <Box sx={gridSx}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} variant="rounded" height={430} sx={{ borderRadius: 4 }} />)
            : crops.map((crop) => <CropCard key={crop.id} crop={crop} detailsPath={(item) => `/crops/${item.id}`} />)}
        </Box>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button component={Link} to="/crop-guide" variant="outlined" size="large" endIcon={<ArrowForwardIcon />}>
            Browse the full crop guide
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default CropsPreviewSection;
