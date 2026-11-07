import { useState } from "react";
import { Box, Dialog, IconButton, Paper, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import { assetUrl } from "../../api";

function RequestImages({ images = [], onDelete, action }) {
  const [preview, setPreview] = useState(null);

  return (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Photos ({images.length})
        </Typography>
        {action}
      </Stack>

      {images.length === 0 ? (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
          <ImageNotSupportedOutlinedIcon fontSize="small" />
          <Typography variant="body2">No photos were attached.</Typography>
        </Stack>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 1.5 }}>
          {images.map((image) => (
            <Box key={image.id} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", aspectRatio: "1" }}>
              <Box
                component="img"
                src={assetUrl(image.file_url)}
                alt={image.original_name}
                onClick={() => setPreview(image)}
                sx={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }}
              />
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={() => onDelete(image)}
                  aria-label={`Delete ${image.original_name}`}
                  sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.55)", color: "#fff", "&:hover": { bgcolor: "error.main" } }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} maxWidth="md">
        {preview && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.55)", color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={assetUrl(preview.file_url)}
              alt={preview.original_name}
              sx={{ display: "block", maxWidth: "100%", maxHeight: "85vh" }}
            />
          </Box>
        )}
      </Dialog>
    </Paper>
  );
}

export default RequestImages;
