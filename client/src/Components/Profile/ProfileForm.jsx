import { useEffect } from "react";
import { Box, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import FormTextField from "../Form/FormTextField";
import SubmitButton from "../Form/SubmitButton";
import { lengthRules, phoneRules } from "../Form/rules";

function ProfileForm({ user, saving, onSave }) {
  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: { name: user.name ?? "", phone: user.phone ?? "" },
    mode: "onTouched",
  });

  useEffect(() => {
    reset({ name: user.name ?? "", phone: user.phone ?? "" });
  }, [user, reset]);

  const submit = (values) => {
    const changes = {};

    if (values.name.trim() !== user.name) {
      changes.name = values.name.trim();
    }

    if (values.phone.trim() && values.phone.trim() !== (user.phone ?? "")) {
      changes.phone = values.phone.trim();
    }

    return onSave(changes);
  };

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          Personal information
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Update the details other people see on your requests.
        </Typography>

        <Stack component="form" spacing={1} onSubmit={handleSubmit(submit)} noValidate>
          <FormTextField
            name="name"
            control={control}
            rules={lengthRules("Name", 3, 50)}
            label="Full name"
            autoComplete="name"
            disabled={saving}
          />
          <TextField label="Email address" value={user.email} disabled fullWidth helperText="Email cannot be changed." />
          <FormTextField
            name="phone"
            control={control}
            rules={phoneRules}
            label="Phone number"
            type="tel"
            autoComplete="tel"
            disabled={saving}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <SubmitButton loading={saving} disabled={saving || !formState.isDirty} loadingText="Saving...">
              Save changes
            </SubmitButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
