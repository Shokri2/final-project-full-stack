import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "../utils/errors";

export const useAsyncAction = () => {
  const [pending, setPending] = useState(false);

  const run = useCallback(async (action, { success, onSuccess, onError } = {}) => {
    setPending(true);

    try {
      const response = await action();
      const message = typeof success === "function" ? success(response) : success ?? response?.data?.message;

      if (message) {
        toast.success(message);
      }

      await onSuccess?.(response);
      return response;
    } catch (error) {
      if (!onError?.(error)) {
        toast.error(getErrorMessage(error));
      }

      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { run, pending };
};
