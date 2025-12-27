import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type UseProductsQueryArgs = {
  page: number;
  limit: number;
  q?: string;
};

export function useProductsQuery({ page, limit, q }: UseProductsQueryArgs) {
  return useQuery({
    // 🔴 BẮT BUỘC: page + limit + q phải nằm trong queryKey
    queryKey: ["products", page, limit, q],

    // 🔴 BẮT BUỘC: truyền page vào params
    queryFn: async () => {
      const res = await axios.get("/api/products", {
        params: {
          page,
          limit,
          q,
        },
      });
      return res.data;
    },

    // Giữ data cũ khi chuyển trang (mượt hơn)
    keepPreviousData: true,
  });
}
