'use client'

import * as React from 'react'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'

export type Priority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'Complete' | 'Incomplete'
export type TaskCategory = {
  label: string
  color: string
}

export const defaultCategoryOptions: TaskCategory[] = [
  { label: 'Work', color: '#2563eb' },
  { label: 'Personal', color: '#16a34a' },
  { label: 'Urgent', color: '#dc2626' }
]

export const defaultCategoryColor = '#2563eb'

const categoryColorByLabel: Record<string, string> = {
  work: '#2563eb',
  personal: '#16a34a',
  urgent: '#dc2626'
}

const fallbackCategoryColors = [
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#7c3aed',
  '#0f766e',
  '#ea580c',
  '#ca8a04',
  '#0891b2',
  '#db2777',
  '#475569'
]

export const getCategoryColor = (label: string) => {
  const normalizedLabel = label.trim().toLowerCase()

  if (!normalizedLabel) {
    return defaultCategoryColor
  }

  const matchingColor = categoryColorByLabel[normalizedLabel]

  if (matchingColor) {
    return matchingColor
  }

  const colorIndex = Array.from(normalizedLabel).reduce((total, character) => {
    return total + character.charCodeAt(0)
  }, 0)

  return fallbackCategoryColors[colorIndex % fallbackCategoryColors.length]
}

export const normalizeTaskCategory = (
  category: string | Partial<TaskCategory> | null | undefined
): TaskCategory | null => {
  if (typeof category === 'string') {
    const label = category.trim()

    return label ? { label, color: getCategoryColor(label) } : null
  }

  if (!category) {
    return null
  }

  const label = String(category.label ?? '').trim()

  if (!label) {
    return null
  }

  const color = String(category.color ?? '').trim() || getCategoryColor(label)

  return {
    label,
    color
  }
}

export const normalizeTaskCategories = (
  categories: Array<string | Partial<TaskCategory>> | null | undefined
): TaskCategory[] =>
  Array.from(
    new Map(
      (categories ?? [])
        .map((category) => normalizeTaskCategory(category))
        .filter((category): category is TaskCategory => category !== null)
        .map((category) => [category.label.toLowerCase(), category])
    ).values()
  )

export type TaskCard = {
  id: number
  title: string
  summary: string
  categories: TaskCategory[]
  priority: Priority
  status: TaskStatus
  assignee: string
  due: string
}

export type KanbanColumn = {
  id: string
  title: string
  accent: string
  icon: React.ReactNode
  tasks: TaskCard[]
}

export const initialColumns: KanbanColumn = {
  id: 'todo',
  title: 'To Do List',
  accent: '#f97316',
  icon: <AccessTimeOutlinedIcon fontSize="small" />,
  tasks: []
}
