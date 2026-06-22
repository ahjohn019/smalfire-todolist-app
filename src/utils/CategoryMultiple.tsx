'use client'

import { normalizeTaskCategories, type TaskCategory } from '@/src/utils/TodoListColumn'

export type CategoryColorOption = {
  value: string
  label: string
}

export const categoryColorOptions: CategoryColorOption[] = [
  { value: '#2563eb', label: 'Blue' },
  { value: '#16a34a', label: 'Green' },
  { value: '#dc2626', label: 'Red' },
  { value: '#7c3aed', label: 'Violet' },
  { value: '#0f766e', label: 'Teal' },
  { value: '#ea580c', label: 'Orange' },
  { value: '#ca8a04', label: 'Amber' },
  { value: '#0891b2', label: 'Cyan' },
  { value: '#db2777', label: 'Pink' },
  { value: '#475569', label: 'Slate' }
]

export const getCategoryValue = (category: TaskCategory) => {
  return JSON.stringify(category)
}

export const parseCategoryValue = (value: string) => {
  try {
    return normalizeTaskCategories([JSON.parse(value) as TaskCategory])[0] ?? null
  } catch {
    return normalizeTaskCategories([{ label: value }])[0] ?? null
  }
}
