import type { TaskCard } from '@/src/hooks/useTodoListColumn'

export const mapTaskcategories = (
  taskCategories: TaskCard['categories'],
  normalizedCategoryLabel: string,
  color: string
) =>
  taskCategories.map((category) =>
    category.label.toLowerCase() === normalizedCategoryLabel
      ? {
          ...category,
          color
        }
      : category
  )
