import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import CropDetailsContent from "../../Components/Crops/CropDetailsContent";

function CropDetails() {
  const { id } = useParams();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <CropDetailsContent cropId={id} backTo="/crop-guide" />
    </Container>
  );
}

export default CropDetails;
