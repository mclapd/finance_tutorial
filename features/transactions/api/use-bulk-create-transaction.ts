import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

export const useBulkCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (json) => {
      const reponse = await client.api.transactions["bulk-create"]["$post"]({
        json,
      });
      return reponse.json();
    },
    onSuccess: () => {
      toast.success("Transactions created successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Also invalidate summary
    },
    onError: () => {
      toast.error("Failed to create transactions");
    },
  });
  return mutation;
};
