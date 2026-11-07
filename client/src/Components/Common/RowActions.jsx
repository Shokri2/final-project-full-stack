import { IconButton, Stack, Tooltip } from "@mui/material";

function RowActions({ actions }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }} onClick={(event) => event.stopPropagation()}>
      {actions
        .filter((action) => !action.hidden)
        .map((action) => (
          <Tooltip key={action.label} title={action.label}>
            <span>
              <IconButton size="small" color={action.color} onClick={action.onClick} disabled={action.disabled} aria-label={action.label}>
                {action.icon}
              </IconButton>
            </span>
          </Tooltip>
        ))}
    </Stack>
  );
}

export default RowActions;
