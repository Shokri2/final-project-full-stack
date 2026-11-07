import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/errors";

export const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    fetcher()
      .then((response) => {
        if (!ignore) {
          setData(response.data);
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [...deps, reloadKey]);

  return { data, setData, loading, error, refetch };
};
