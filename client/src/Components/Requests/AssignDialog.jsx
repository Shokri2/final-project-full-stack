import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  TextField,
} from "@mui/material";
import LoadingState from "../Common/LoadingState";
import SubmitButton from "../Form/SubmitButton";
import { useFetch } from "../../Hooks/useFetch";
import { getEligibleAgronomists } from "../../api/requestsApi";

function AssignDialog({ open, request, loading, onSubmit, onClose }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const fetchAgronomists = useCallback(
    () => (open ? getEligibleAgronomists(request.id) : Promise.resolve({ data: { agronomists: [] } })),
    [open, request.id],
  );
  const { data, loading: listLoading } = useFetch(fetchAgronomists, [fetchAgronomists]);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setNote("");
    }
  }, [open]);

  const agronomists = data?.agronomists ?? [];
  const isReassign = Boolean(request.agronomist);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>{isReassign ? "Reassign request" : "Assign an agronomist"}</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Only active agronomists specialised in <strong>{request.crop.category_name}</strong> are listed, least busy first.
        </Alert>
        {listLoading ? (
          <LoadingState />
        ) : agronomists.length === 0 ? (
          <Alert severity="warning">No agronomist covers this category yet. Add the specialty to an agronomist first.</Alert>
        ) : (
          <List disablePadding>
            {agronomists.map((agronomist) => {
              const current = agronomist.id === request.agronomist?.id;

              return (
                <ListItemButton
                  key={agronomist.id}
                  selected={selected === agronomist.id}
                  disabled={current}
                  onClick={() => setSelected(agronomist.id)}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Radio edge="start" checked={selected === agronomist.id} tabIndex={-1} disableRipple />
                  </ListItemIcon>
                  <ListItemText primary={agronomist.name} secondary={agronomist.email} />
                  <Chip
                    size="small"
                    label={current ? "Current" : `${agronomist.open_requests} open`}
                    color={current ? "primary" : agronomist.open_requests > 3 ? "warning" : "default"}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
        <TextField
          label="Note for the history (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <SubmitButton
          type="button"
          size="medium"
          loading={loading}
          disabled={loading || !selected}
          onClick={() => onSubmit({ agronomist_id: selected, ...(note.trim() ? { note: note.trim() } : {}) })}
          loadingText="Assigning..."
        >
          {isReassign ? "Reassign" : "Assign"}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}

export default AssignDialog;
