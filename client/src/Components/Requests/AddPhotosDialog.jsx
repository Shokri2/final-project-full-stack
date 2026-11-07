import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ImageUploader from "./ImageUploader";
import SubmitButton from "../Form/SubmitButton";

function AddPhotosDialog({ open, remaining, loading, onSubmit, onClose }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (open) {
      setFiles([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>Add photos</DialogTitle>
      <DialogContent>
        <ImageUploader files={files} onChange={setFiles} maxFiles={remaining} disabled={loading} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <SubmitButton
          type="button"
          size="medium"
          loading={loading}
          disabled={loading || files.length === 0}
          onClick={() => onSubmit(files)}
          loadingText="Uploading..."
        >
          Upload
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}

export default AddPhotosDialog;
