import { Button, CircularProgress } from "@mui/material";

function SubmitButton({ loading, children, loadingText, ...props }) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
      {...props}
    >
      {loading ? loadingText ?? children : children}
    </Button>
  );
}

export default SubmitButton;
