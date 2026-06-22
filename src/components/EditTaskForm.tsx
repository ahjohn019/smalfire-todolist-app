'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CategoryMultiple from '@/src/components/CategoryMultiple'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { TaskCategory } from '@/src/utils/TodoListColumn'

export type EditTaskPriority = 'High' | 'Medium' | 'Low'
export type EditTaskStatus = 'Complete' | 'Incomplete'

export type EditTaskFormValues = {
  title: string
  summary: string
  categories: TaskCategory[]
  priority: EditTaskPriority
  status: EditTaskStatus
  assignee: string
  due: string
}

type EditTaskFormProps = {
  initialValues?: Partial<EditTaskFormValues>
  onCancel: () => void
  onSubmit?: (values: EditTaskFormValues) => void
}

const defaultFormValues: EditTaskFormValues = {
  title: '',
  summary: '',
  categories: [],
  priority: 'Medium',
  status: 'Incomplete',
  assignee: '',
  due: ''
}

const priorities: EditTaskPriority[] = ['High', 'Medium', 'Low']
const statuses: EditTaskStatus[] = ['Complete', 'Incomplete']
const monthIndexByLabel: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
}

const toIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const normalizeDueDate = (due: string | undefined) => {
  if (!due) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    return due
  }

  if (due === 'Today') {
    return toIsoDate(new Date())
  }

  const monthDayMatch = due?.match(/^([A-Z][a-z]{2}) (\d{1,2})$/)

  if (!monthDayMatch) {
    return ''
  }

  const [, monthLabel, dayValue] = monthDayMatch
  const monthIndex = monthIndexByLabel[monthLabel]

  if (monthIndex !== undefined) {
    return toIsoDate(new Date(new Date().getFullYear(), monthIndex, Number(dayValue)))
  }

  const parsedDate = new Date(due)

  return Number.isNaN(parsedDate.getTime()) ? '' : toIsoDate(parsedDate)
}

export default function EditTaskForm({ initialValues, onCancel, onSubmit }: EditTaskFormProps) {
  const [formValues, setFormValues] = React.useState<EditTaskFormValues>(() => ({
    ...defaultFormValues,
    ...initialValues,
    categories: initialValues?.categories ?? defaultFormValues.categories,
    due: normalizeDueDate(initialValues?.due)
  }))
  const minimumDueDate = toIsoDate(new Date())

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target

    setFormValues((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleCategoryChange = (categories: TaskCategory[]) => {
    setFormValues((current) => ({
      ...current,
      categories
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formValues.due < minimumDueDate) {
      return
    }

    if (onSubmit) {
      onSubmit(formValues)
    }

    onCancel()
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          required
          fullWidth
          label="Task title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Summary"
          name="summary"
          value={formValues.summary}
          onChange={handleChange}
        />
        <CategoryMultiple value={formValues.categories} onChange={handleCategoryChange} />
        <TextField
          select
          fullWidth
          label="Priority"
          name="priority"
          value={formValues.priority}
          onChange={handleChange}
        >
          {priorities.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={formValues.status}
          onChange={handleChange}
        >
          {statuses.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          fullWidth
          label="Due date"
          name="due"
          type="date"
          value={formValues.due}
          onChange={handleChange}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: minimumDueDate }
          }}
        />
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
          <Button color="inherit" variant="text" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
