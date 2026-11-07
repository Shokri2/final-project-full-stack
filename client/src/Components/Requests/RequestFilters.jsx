import TableToolbar from "../Common/TableToolbar";
import FilterSelect from "../Common/FilterSelect";
import { PRIORITY_OPTIONS, REQUEST_STATUS_OPTIONS } from "./requestOptions";
import { formatLabel } from "../../utils/format";

const statusOptionsFor = (current) => {
  if (!current || REQUEST_STATUS_OPTIONS.some((option) => option.value === current)) {
    return REQUEST_STATUS_OPTIONS;
  }

  const label = current.split(",").map(formatLabel).join(" + ");
  return [{ value: current, label }, ...REQUEST_STATUS_OPTIONS];
};

function RequestFilters({ query, setSearch, setFilter, resetFilters, placeholder, children }) {
  return (
    <TableToolbar
      search={query.search}
      onSearch={setSearch}
      placeholder={placeholder ?? "Search by title or crop..."}
      showReset={Boolean(query.search || query.status || query.priority)}
      onReset={resetFilters}
    >
      <FilterSelect
        label="Status"
        value={query.status}
        onChange={(value) => setFilter("status", value)}
        options={statusOptionsFor(query.status)}
        allLabel="All statuses"
      />
      <FilterSelect
        label="Priority"
        value={query.priority}
        onChange={(value) => setFilter("priority", value)}
        options={PRIORITY_OPTIONS}
        allLabel="Any priority"
        minWidth={140}
      />
      {children}
    </TableToolbar>
  );
}

export default RequestFilters;
