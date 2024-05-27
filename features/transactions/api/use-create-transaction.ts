import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (json) => {
      const reponse = await client.api.transactions.$post({ json });
      return reponse.json();
    },
    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error("Failed to create transaction");
    },
  });
  return mutation;
};
