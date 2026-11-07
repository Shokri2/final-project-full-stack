import { useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FormTextField from "../Form/FormTextField";
import SubmitButton from "../Form/SubmitButton";
import { emailRules, lengthRules } from "../Form/rules";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { sendContactMessage } from "../../api/contactApi";
import { applyFieldErrors } from "../../utils/errors";

const empty = { name: "", email: "", subject: "", message: "" };

const fieldStyles = {
  "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#FFFFFF", color: "#263A2A" },
  "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.85)", mx: 0.5 },
  "& .MuiFormHelperText-root.Mui-error": { color: "#FFD2CC" },
  "& .MuiInputLabel-root": { color: "#52665A" },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": { color: "#FFFFFF", transform: "translate(4px, -22px) scale(0.85)" },
};

function ContactForm() {
  const { run, pending } = useAsyncAction();
  const [sent, setSent] = useState(false);
  const { control, handleSubmit, reset, setError } = useForm({ defaultValues: empty, mode: "onTouched" });

  const onSubmit = (values) =>
    run(
      () =>
        sendContactMessage({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      {
        onSuccess: () => {
          reset(empty);
          setSent(true);
        },
        onError: (error) => applyFieldErrors(error, setError) && false,
      },
    );

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ pt: 1 }}>
      <Typography component="h3" sx={{ fontSize: { xs: 23, md: 27 }, fontWeight: 800, color: "#f4fbf5" }}>
        Send Us a Message
      </Typography>
      <Typography sx={{ color: "#ffffff", fontSize: 14, lineHeight: 1.8, mt: "4px !important" }}>
        Let’s grow a smarter future together
      </Typography>

      {sent && (
        <Alert severity="success" onClose={() => setSent(false)}>
          Thank you! Your message was sent. We will get back to you soon.
        </Alert>
      )}

      <FormTextField
        name="name"
        control={control}
        rules={lengthRules("Name", 2, 100)}
        placeholder="Your full name"
        label="Your Name"
        autoComplete="name"
        disabled={pending}
        sx={fieldStyles}
      />
      <FormTextField
        name="email"
        control={control}
        rules={emailRules}
        placeholder="you@example.com"
        label="Your Email"
        type="email"
        autoComplete="email"
        disabled={pending}
        sx={fieldStyles}
      />
      <FormTextField
        name="subject"
        control={control}
        rules={lengthRules("Subject", 3, 150)}
        placeholder="What is it about?"
        label="Subject"
        disabled={pending}
        sx={fieldStyles}
      />
      <FormTextField
        name="message"
        control={control}
        rules={lengthRules("Message", 10, 5000)}
        placeholder="Tell us about your farm or how we can help..."
        label="Your Message"
        multiline
        minRows={4}
        disabled={pending}
        sx={fieldStyles}
      />
      <SubmitButton
        loading={pending}
        loadingText="Sending..."
        fullWidth
        endIcon={<SendRoundedIcon />}
        sx={{
          py: 1.6,
          borderRadius: "12px",
          bgcolor: "#D9F36A",
          color: "#183D2A",
          fontWeight: 800,
          "&:hover": { bgcolor: "#E8FF91" },
        }}
      >
        Send Message
      </SubmitButton>
    </Stack>
  );
}

export default ContactForm;
