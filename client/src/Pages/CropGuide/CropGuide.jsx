import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";

import { getCrops, getCropDetails } from "../../api/cropsApi";
import Header from "../../Components/Common/Header";
import Footer from "../../Components/Common/Footer";

const cropImages = {
  Tomato:
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&auto=format&fit=crop",
  Cucumber:
    "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&auto=format&fit=crop",
  Lettuce:
    "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&auto=format&fit=crop",
  Pepper:
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop",
  Eggplant:
    "https://images.unsplash.com/photo-1653642690505-15e5e4e7f5c0?w=800&auto=format&fit=crop",
  Carrot:
    "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&auto=format&fit=crop",
  Potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop",
  Onion:
    "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop",
  Spinach:
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop",
  Strawberry:
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop",
  Zucchini:
    "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&auto=format&fit=crop",
  Broccoli:
    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop";

const getCropImage = (crop) => cropImages[crop.name] || DEFAULT_IMAGE;

function CropGuide() {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await getCrops();
        setCrops(response.data || []);
      } catch (err) {
        setError("Unable to load crops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const handleViewDetails = async (cropId) => {
    setSelectedCrop(null);
    setDetailsLoading(true);
    setError("");

    try {
      const response = await getCropDetails(cropId);
      setSelectedCrop(response.data);
    } catch (err) {
      setError("Unable to load crop details. Please try again.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCrop(null);
    setDetailsLoading(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          width: "100%",
          bgcolor: "#FFFFFF",
          boxShadow: "0 2px 10px rgba(24,61,42,0.08)",
        }}
      >
        <Header />
      </Box>

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7FAF5",
          py: { xs: 5, md: 8 },
          scrollMarginTop: "90px",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "#246B3D",
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: "#183D2A",
                fontSize: {
                  xs: "2.2rem",
                  sm: "2.8rem",
                  md: "3.5rem",
                },
                fontWeight: 900,
                lineHeight: 1.15,
                mt: 1,
                mb: 2,
              }}
            >
              Grow Smarter.
              <Box component="span" sx={{ color: "#65A343" }}>
                {" "}
                Harvest Better.
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#607064",
                maxWidth: 680,
                mx: "auto",
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                lineHeight: 1.8,
              }}
            >
              Discover the right crops for your farm, explore their growing
              requirements, and follow every stage from planting to harvest.
            </Typography>

            {!loading && crops.length > 0 && (
              <Box
                sx={{
                  display: "inline-flex",
                  mt: 3,
                  px: 2.5,
                  py: 1,
                  bgcolor: "#E8F2E4",
                  borderRadius: 10,
                  color: "#246B3D",
                  fontWeight: 700,
                }}
              >
                {crops.length} Crops Available
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                py: 10,
              }}
            >
              <CircularProgress sx={{ color: "#246B3D" }} />
              <Typography color="text.secondary">Loading crops...</Typography>
            </Box>
          ) : crops.length === 0 ? (
            !error && <Alert severity="info">No crops are available yet.</Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {crops.map((crop) => (
                <Card
                  key={crop.id}
                  sx={{
                    width: "100%",
                    height: 460,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 6px 24px rgba(24,61,42,0.08)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 30px rgba(24,61,42,0.15)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getCropImage(crop)}
                    alt={crop.name}
                    sx={{
                      width: "100%",
                      height: 210,
                      minHeight: 210,
                      objectFit: "cover",
                      bgcolor: "#E8F2E4",
                    }}
                  />

                  <CardContent
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      minHeight: 0,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#183D2A",
                        fontWeight: 800,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {crop.name_ar || crop.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#68776B",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.9em",
                      }}
                    >
                      {crop.description}
                    </Typography>

                    <Box sx={{ mt: "auto", pt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                          color: "#246B3D",
                        }}
                      >
                        <ThermostatOutlinedIcon fontSize="small" />
                        <Typography variant="body2">
                          {crop.temperature_min}°C – {crop.temperature_max}°C
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleViewDetails(crop.id)}
                        sx={{
                          bgcolor: "#246B3D",
                          borderRadius: 2,
                          py: 1.2,
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "#183D2A",
                          },
                        }}
                      >
                        View Growing Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      <Dialog
        open={Boolean(selectedCrop) || detailsLoading}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            color: "#183D2A",
            fontWeight: 800,
            pr: 7,
          }}
        >
          {detailsLoading
            ? "Loading Crop Details"
            : selectedCrop?.name_ar || selectedCrop?.name}

          <IconButton
            aria-label="Close"
            onClick={handleCloseDetails}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {detailsLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >
              <CircularProgress sx={{ color: "#246B3D" }} />
            </Box>
          ) : (
            selectedCrop && (
              <Box>
                <Box
                  component="img"
                  src={getCropImage(selectedCrop)}
                  alt={selectedCrop.name}
                  sx={{
                    width: "100%",
                    height: 240,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 3,
                  }}
                />

                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedCrop.description}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ p: 2, bgcolor: "#F0F6ED", borderRadius: 2 }}>
                    <WaterDropOutlinedIcon sx={{ color: "#246B3D" }} />
                    <Typography fontWeight={700}>Water Requirements</Typography>
                    <Typography variant="body2">
                      {selectedCrop.water_needs}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: "#F0F6ED", borderRadius: 2 }}>
                    <ThermostatOutlinedIcon sx={{ color: "#246B3D" }} />
                    <Typography fontWeight={700}>Temperature</Typography>
                    <Typography variant="body2">
                      {selectedCrop.temperature_min}°C –{" "}
                      {selectedCrop.temperature_max}°C
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: "#F0F6ED", borderRadius: 2 }}>
                    <WbSunnyOutlinedIcon sx={{ color: "#246B3D" }} />
                    <Typography fontWeight={700}>Sunlight</Typography>
                    <Typography variant="body2">
                      {selectedCrop.sunlight}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: "#F0F6ED", borderRadius: 2 }}>
                    <Typography fontWeight={700}>Soil Type</Typography>
                    <Typography variant="body2">
                      {selectedCrop.soil_type}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  sx={{ color: "#183D2A", fontWeight: 800, mb: 2 }}
                >
                  Growth Stages
                </Typography>

                {selectedCrop.growth_stages?.length ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 2,
                    }}
                  >
                    {selectedCrop.growth_stages.map((stage) => (
                      <Box
                        key={stage.id}
                        sx={{
                          p: 2,
                          border: "1px solid #DCE8D8",
                          borderRadius: 2,
                        }}
                      >
                        <Typography fontWeight={700} sx={{ color: "#246B3D" }}>
                          {stage.stage_order}. {stage.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Duration: {stage.duration_days} days
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, color: "#607064" }}
                        >
                          {stage.tips}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Growth stages have not been added for this crop yet.
                  </Typography>
                )}
              </Box>
            )
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}

export default CropGuide;
