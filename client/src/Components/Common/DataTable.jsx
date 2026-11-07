import {
  Box,
  Card,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

const renderCell = (column, row) => {
  return column.render ? column.render(row) : row[column.field] ?? "—";
};

function MobileRows({ columns, rows, getRowId, onRowClick }) {
  return (
    <Stack spacing={1.5} sx={{ p: 1.5 }}>
      {rows.map((row) => (
        <Card
          key={getRowId(row)}
          variant="outlined"
          onClick={onRowClick ? () => onRowClick(row) : undefined}
          sx={{ p: 2, borderRadius: 2, cursor: onRowClick ? "pointer" : "default" }}
        >
          <Stack spacing={1}>
            {columns.map((column) => (
              <Box key={column.field} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                {column.headerName && (
                  <Typography color="text.secondary" fontSize={13} fontWeight={600} sx={{ flexShrink: 0 }}>
                    {column.headerName}
                  </Typography>
                )}
                <Box sx={{ textAlign: "right", minWidth: 0, wordBreak: "break-word" }}>
                  {renderCell(column, row)}
                </Box>
              </Box>
            ))}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

function DataTable({
  columns,
  rows = [],
  loading,
  error,
  onRetry,
  pagination,
  onPageChange,
  onLimitChange,
  sort,
  order,
  onSortChange,
  onRowClick,
  getRowId = (row) => row.id,
  emptyTitle = "No results found",
  emptyDescription = "Try changing your search or filters.",
  emptyAction,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  let body;

  if (loading) {
    body = <Box sx={{ p: 2 }}><LoadingState variant="skeleton" rows={Math.min(pagination?.limit ?? 5, 6)} /></Box>;
  } else if (error) {
    body = <Box sx={{ p: 2 }}><ErrorState message={error} onRetry={onRetry} /></Box>;
  } else if (rows.length === 0) {
    body = <EmptyState title={emptyTitle} description={emptyDescription} {...emptyAction} />;
  } else if (isMobile) {
    body = <MobileRows columns={columns} rows={rows} getRowId={getRowId} onRowClick={onRowClick} />;
  } else {
    body = (
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align}
                  sx={{ fontWeight: 700, whiteSpace: "nowrap", width: column.width }}
                  sortDirection={sort === column.sortField ? order : false}
                >
                  {column.sortField && onSortChange ? (
                    <TableSortLabel
                      active={sort === column.sortField}
                      direction={sort === column.sortField ? order : "asc"}
                      onClick={() => onSortChange(column.sortField)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((column) => (
                  <TableCell key={column.field} align={column.align}>
                    {renderCell(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
      {body}
      {pagination && !error && pagination.total > 0 && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[5, 10, 20, 50]}
          onPageChange={(_, page) => onPageChange(page + 1)}
          onRowsPerPageChange={(event) => onLimitChange(Number(event.target.value))}
          labelRowsPerPage={isMobile ? "Rows" : "Rows per page"}
          sx={{ borderTop: 1, borderColor: "divider" }}
        />
      )}
    </Paper>
  );
}

export default DataTable;
