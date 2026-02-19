import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dbRead from "../utils/read";
import dbWrite from "../utils/write";

export interface CustomCategoryType {
  id: number;
  key: string;
  text: string;
  color: string;
  icon: string;
}

const USE_CUSTOM_CATEGORIES_QUERY_KEY = "useCustomCategories";

export default function useCustomCategories() {
  return useQuery({
    queryKey: [USE_CUSTOM_CATEGORIES_QUERY_KEY],
    queryFn: () => {
      return dbRead<CustomCategoryType>(
        "SELECT * FROM custom_categories ORDER BY id ASC"
      );
    },
  });
}

export function useAddCustomCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Omit<CustomCategoryType, "id">) =>
      dbWrite(
        `INSERT INTO custom_categories 
         (key, text, color, icon) 
         VALUES (?, ?, ?, ?)`,
        [
          category.key,
          category.text,
          category.color,
          category.icon,
        ]
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USE_CUSTOM_CATEGORIES_QUERY_KEY] });
    },
  });
}

export function useDeleteCustomCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dbWrite("DELETE FROM custom_categories WHERE id = ?", [id]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USE_CUSTOM_CATEGORIES_QUERY_KEY] });
    },
  });
} 
