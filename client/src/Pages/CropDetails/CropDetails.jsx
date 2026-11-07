import { useParams } from "react-router-dom";
import CropDetailsContent from "../../Components/Crops/CropDetailsContent";

function CropDetails() {
  const { id } = useParams();

  return <CropDetailsContent cropId={id} backTo="/crop-guide" />;
}

export default CropDetails;
