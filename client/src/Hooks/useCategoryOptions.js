import { useMemo } from "react";
import { useFetch } from "./useFetch";
import { getCategories } from "../api/categoriesApi";

export const useCategoryOptions = () => {
  const { data, loading, refetch } = useFetch(() => getCategories({ limit: 100, sort: "name", order: "asc" }), []);

  const options = useMemo(
    () => (data?.categories ?? []).map((category) => ({ value: category.id, label: category.name })),
    [data],
  );

  return { options, categories: data?.categories ?? [], loading, refetch };
};
