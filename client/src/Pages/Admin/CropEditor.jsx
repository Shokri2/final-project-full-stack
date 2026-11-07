import { useCallback, useEffect } from "react";
import { Box, Button, Card, CardContent, Divider, FormControlLabel, Stack, Switch } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../Components/Common/PageHeader";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import SubmitButton from "../../Components/Form/SubmitButton";
import CropFormFields from "../../Components/Admin/Crops/CropFormFields";
import GrowthStagesEditor from "../../Components/Admin/Crops/GrowthStagesEditor";
import { useFetch } from "../../Hooks/useFetch";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { useCategoryOptions } from "../../Hooks/useCategoryOptions";
import { createCrop, getManagedCrop, updateCrop } from "../../api/cropsApi";
import { applyFieldErrors } from "../../utils/errors";

const textFields = ["name", "name_ar", "description", "image", "water_needs", "sunlight", "soil_type"];
const numberFields = ["temperature_min", "temperature_max", "growth_duration_days"];

const toFormValues = (crop) => ({
  ...Object.fromEntries(textFields.map((field) => [field, crop?.[field] ?? ""])),
  ...Object.fromEntries(numberFields.map((field) => [field, crop?.[field] != null ? Number(crop[field]) : ""])),
  category_id: crop?.category_id ?? "",
  is_active: crop?.is_active ?? true,
  growth_stages: (crop?.growth_stages ?? []).map((stage) => ({
    name: stage.name,
    name_ar: stage.name_ar,
    duration_days: stage.duration_days ?? "",
    tips: stage.tips ?? "",
  })),
});

const toPayload = (values) => ({
  ...Object.fromEntries(textFields.map((field) => [field, values[field].trim()])),
  ...Object.fromEntries(numberFields.map((field) => [field, values[field] === "" ? null : Number(values[field])])),
  category_id: values.category_id,
  is_active: values.is_active,
  growth_stages: values.growth_stages.map((stage) => ({
    name: stage.name.trim(),
    name_ar: stage.name_ar.trim(),
    duration_days: stage.duration_days === "" ? null : Number(stage.duration_days),
    tips: stage.tips.trim(),
  })),
});

function CropEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { options: categoryOptions } = useCategoryOptions();
  const { run, pending } = useAsyncAction();
  const fetchCrop = useCallback(() => (isNew ? Promise.resolve({ data: null }) : getManagedCrop(id)), [id, isNew]);
  const { data, loading, error, refetch } = useFetch(fetchCrop, [fetchCrop]);

  const { control, handleSubmit, reset, getValues, setError, formState } = useForm({ defaultValues: toFormValues(null), mode: "onTouched" });

  useEffect(() => {
    if (data?.data) {
      reset(toFormValues(data.data));
    }
  }, [data, reset]);

  if (loading) {
    return <LoadingState message="Loading crop..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const onSubmit = (values) =>
    run(() => (isNew ? createCrop(toPayload(values)) : updateCrop(id, toPayload(values))), {
      onSuccess: () => navigate("/admin/crops"),
      onError: (requestError) => applyFieldErrors(requestError, setError) && false,
    });

  const title = isNew ? "New crop" : `Edit ${data?.data?.name}`;

  return (
    <>
      <PageHeader title={title} breadcrumbs={[{ label: "Crops", to: "/admin/crops" }, { label: isNew ? "New" : data?.data?.name }]} />

      <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, maxWidth: 980 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <CropFormFields control={control} categoryOptions={categoryOptions} disabled={pending} getValues={getValues} />

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={pending} />}
                  label={field.value ? "Visible to farmers" : "Hidden from farmers"}
                />
              )}
            />

            <Divider sx={{ my: 3 }} />
            <GrowthStagesEditor control={control} disabled={pending} />

            <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end", mt: 4 }}>
              <Button component={Link} to="/admin/crops" color="inherit" disabled={pending}>
                Cancel
              </Button>
              <SubmitButton loading={pending} disabled={pending || (!isNew && !formState.isDirty)} loadingText="Saving...">
                {isNew ? "Create crop" : "Save changes"}
              </SubmitButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default CropEditor;
