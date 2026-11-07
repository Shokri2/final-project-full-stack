import { Chip, Link as MuiLink, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function WorkloadTable({ rows = [] }) {
  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No agronomists yet.
      </Typography>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 700 }}>Agronomist</TableCell>
          <TableCell sx={{ fontWeight: 700 }} align="right">
            Open
          </TableCell>
          <TableCell sx={{ fontWeight: 700 }} align="right">
            Completed
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <MuiLink component={Link} to={`/admin/users/${row.id}`} underline="hover" color="inherit" fontWeight={600}>
                {row.name}
              </MuiLink>
              {!row.is_active && <Chip label="Inactive" size="small" color="error" sx={{ ml: 1 }} />}
            </TableCell>
            <TableCell align="right">
              <Chip size="small" label={row.open_requests} color={row.open_requests > 3 ? "warning" : "default"} />
            </TableCell>
            <TableCell align="right">{row.completed_requests}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default WorkloadTable;
