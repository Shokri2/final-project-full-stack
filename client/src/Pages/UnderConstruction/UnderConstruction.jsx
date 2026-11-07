import { Paper } from "@mui/material";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import EmptyState from "../../Components/Common/EmptyState";

function UnderConstruction({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
        <EmptyState
          icon={<ConstructionOutlinedIcon />}
          title="This page is being built"
          description="It is part of the next development phase."
        />
      </Paper>
    </>
  );
}

export default UnderConstruction;
