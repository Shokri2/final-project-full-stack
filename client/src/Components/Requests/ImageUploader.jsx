import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, FormHelperText, IconButton, Stack, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./requestOptions";

function ImageUploader({ files, onChange, maxFiles = 3, disabled }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  const handleSelect = (event) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    const invalidType = selected.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
    const tooBig = selected.find((file) => file.size > MAX_IMAGE_SIZE);

    if (invalidType) {
      setError(`${invalidType.name} is not a JPG, PNG or WEBP image.`);
      return;
    }

    if (tooBig) {
      setError(`${tooBig.name} is larger than 5 MB.`);
      return;
    }

    if (files.length + selected.length > maxFiles) {
      setError(`You can add up to ${maxFiles} images.`);
      return;
    }

    setError("");
    onChange([...files, ...selected]);
  };

  const remove = (index) => onChange(files.filter((_, current) => current !== index));

  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }} useFlexGap>
        {previews.map((preview, index) => (
          <Box
            key={preview.url}
            sx={{ position: "relative", width: 104, height: 104, borderRadius: 2, overflow: "hidden", border: 1, borderColor: "divider" }}
          >
            <Box component="img" src={preview.url} alt={preview.file.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <IconButton
              size="small"
              onClick={() => remove(index)}
              disabled={disabled}
              aria-label={`Remove ${preview.file.name}`}
              sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.55)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.75)" } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {files.length < maxFiles && (
          <Button
            variant="outlined"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            sx={{ width: 104, height: 104, flexDirection: "column", gap: 0.5, borderStyle: "dashed", borderRadius: 2 }}
          >
            <AddPhotoAlternateOutlinedIcon />
            <Typography variant="caption">Add photo</Typography>
          </Button>
        )}
      </Stack>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple
        hidden
        onChange={handleSelect}
      />

      <FormHelperText error={Boolean(error)} sx={{ mt: 1 }}>
        {error || `Up to ${maxFiles} images (JPG, PNG or WEBP, max 5 MB each). Clear photos help the agronomist.`}
      </FormHelperText>
    </Box>
  );
}

export default ImageUploader;
