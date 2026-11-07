import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import FormTextField from "./FormTextField";

function FormPasswordField(props) {
  const [visible, setVisible] = useState(false);

  return (
    <FormTextField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisible((value) => !value)}
                edge="end"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default FormPasswordField;
