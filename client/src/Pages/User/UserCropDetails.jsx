import { useParams } from "react-router-dom";
import CropDetailsContent from "../../Components/Crops/CropDetailsContent";

function UserCropDetails() {
  const { id } = useParams();

  return <CropDetailsContent cropId={id} backTo="/user/crops" />;
}

export default UserCropDetails;
