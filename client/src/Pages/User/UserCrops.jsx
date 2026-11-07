import PageHeader from "../../Components/Common/PageHeader";
import CropBrowser from "../../Components/Crops/CropBrowser";

function UserCrops() {
  return (
    <>
      <PageHeader
        title="Crop guide"
        subtitle="Explore growing requirements and stages, then ask an agronomist about your crop."
      />
      <CropBrowser detailsPath={(crop) => `/user/crops/${crop.id}`} />
    </>
  );
}

export default UserCrops;
