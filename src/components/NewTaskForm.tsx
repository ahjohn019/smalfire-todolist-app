'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CategoryMultiple from '@/src/components/CategoryMultiple'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { TaskCategory } from '@/src/hooks/useTodoListColumn'

type NewTaskFormProps = {
  onCancel: () => void
  onCreateTask: (values: NewTaskFormValues) => void
}

export type NewTaskPriority = 'High' | 'Medium' | 'Low'
export type NewTaskStatus = 'Complete' | 'Incomplete'

export type NewTaskFormValues = {
  title: string
  summary: string
  categories: TaskCategory[]
  priority: NewTaskPriority
  status: NewTaskStatus
  assignee: string
  due: string
}

const initialFormValues: NewTaskFormValues = {
  title: '',
  summary: '',
  categories: [],
  priority: 'Medium',
  status: 'Incomplete',
  assignee: '',
  due: ''
}

const priorities: NewTaskPriority[] = ['High', 'Medium', 'Low']
const statuses: NewTaskStatus[] = ['Complete', 'Incomplete']

const toIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function NewTaskForm({ onCancel, onCreateTask }: NewTaskFormProps) {
  const [formValues, setFormValues] = React.useState<NewTaskFormValues>(initialFormValues)
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

    onCreateTask(formValues)

    setFormValues(initialFormValues)
    onCancel()
  }

  const handleCancel = () => {
    setFormValues(initialFormValues)
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
          <Button color="inherit" variant="text" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save Task
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
