import { useQuery } from "@tanstack/react-query";

type UseProductsQueryArgs = {
  page: number;
  limit: number;
  q?: string;
};

export function useProductsQuery({ page, limit, q }: UseProductsQueryArgs) {
  return useQuery({
    // 🔴 QUAN TRỌNG: page + limit + q phải có trong queryKey
    queryKey: ["products", page, limit, q],

    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (q) params.set("q", q);

      const res = await fetch(`/api/products?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      return res.json();
    },

    keepPreviousData: true,
  });
}
