import { useState } from "react";
import { Box, Button, Card, CardContent, Stack } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import PageHeader from "../../Components/Common/PageHeader";
import RequestForm from "../../Components/Requests/RequestForm";
import ImageUploader from "../../Components/Requests/ImageUploader";
import SubmitButton from "../../Components/Form/SubmitButton";
import { useFetch } from "../../Hooks/useFetch";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { getCrops } from "../../api/cropsApi";
import { createRequest } from "../../api/requestsApi";
import { applyFieldErrors } from "../../utils/errors";

const toFormData = (values, images) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      formData.append(key, typeof value === "string" ? value.trim() : value);
    }
  });

  images.forEach((image) => formData.append("images", image));

  return formData;
};

function NewRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const { run, pending } = useAsyncAction();
  const crops = useFetch(() => getCrops({ limit: 100, sort: "name", order: "asc" }).then((data) => ({ data })), []);

  const { control, handleSubmit, setError } = useForm({
    defaultValues: {
      crop_id: searchParams.get("crop_id") ?? "",
      priority: "medium",
      title: "",
      description: "",
      farm_location: "",
      field_area_m2: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values) =>
    run(() => createRequest(toFormData(values, images)), {
      onSuccess: (response) => navigate(`/user/requests/${response.data.request.id}`, { replace: true }),
      onError: (error) => applyFieldErrors(error, setError) && false,
    });

  const cropList = [...(crops.data?.data ?? [])].sort((a, b) => a.category_name.localeCompare(b.category_name));

  return (
    <>
      <PageHeader
        title="New consultation request"
        subtitle="Describe your problem and an agronomist who specialises in your crop will answer."
        breadcrumbs={[{ label: "My requests", to: "/user/requests" }, { label: "New request" }]}
      />

      <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, maxWidth: 900 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <RequestForm control={control} crops={cropList} cropsLoading={crops.loading} disabled={pending} />
            <ImageUploader files={images} onChange={setImages} disabled={pending} />

            <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end", mt: 4 }}>
              <Button component={Link} to="/user/requests" color="inherit" disabled={pending}>
                Cancel
              </Button>
              <SubmitButton loading={pending} loadingText="Submitting...">
                Submit request
              </SubmitButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default NewRequest;
