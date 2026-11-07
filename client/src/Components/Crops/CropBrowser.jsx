import { useCallback, useMemo } from "react";
import { Box, Pagination, Skeleton, Typography } from "@mui/material";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import CropCard from "./CropCard";
import CropFilters from "./CropFilters";
import EmptyState from "../Common/EmptyState";
import ErrorState from "../Common/ErrorState";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { getCrops } from "../../api/cropsApi";
import { getCategories } from "../../api/categoriesApi";

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  gap: 3,
};

function CropBrowser({ detailsPath }) {
  const { query, setPage, setSearch, setFilter, setSortOrder, resetFilters } = useTableQuery({
    sort: "name",
    order: "asc",
    limit: 9,
    filters: ["category_id"],
  });

  const fetchCrops = useCallback(() => getCrops(query).then((data) => ({ data })), [query]);
  const crops = useFetch(fetchCrops, [fetchCrops]);
  const categories = useFetch(() => getCategories({ limit: 100, sort: "name", order: "asc" }), []);

  const categoryList = useMemo(
    () => (categories.data?.categories ?? []).filter((category) => category.active_crops_count > 0),
    [categories.data],
  );

  const list = crops.data?.data ?? [];
  const pagination = crops.data?.pagination;

  return (
    <Box>
      <CropFilters
        categories={categoryList}
        query={query}
        onSearch={setSearch}
        onCategory={(value) => setFilter("category_id", value)}
        onSort={setSortOrder}
      />

      {crops.error && <ErrorState message={crops.error} onRetry={crops.refetch} />}

      {crops.loading && (
        <Box sx={gridSx}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={430} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      )}

      {!crops.loading && !crops.error && list.length === 0 && (
        <EmptyState
          icon={<SpaOutlinedIcon />}
          title="No crops match your search"
          description="Try another name or clear the filters."
          actionLabel="Clear filters"
          onAction={resetFilters}
        />
      )}

      {!crops.loading && !crops.error && list.length > 0 && (
        <>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Showing {list.length} of {pagination.total} crops
          </Typography>
          <Box sx={gridSx}>
            {list.map((crop) => (
              <CropCard key={crop.id} crop={crop} detailsPath={detailsPath} />
            ))}
          </Box>
          {pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(_, page) => {
                  setPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default CropBrowser;
