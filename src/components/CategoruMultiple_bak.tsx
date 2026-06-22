'use client'

import * as React from 'react'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { SelectChangeEvent } from '@mui/material/Select'
import {
  defaultCategoryColor,
  defaultCategoryOptions,
  normalizeTaskCategories,
  type TaskCategory
} from '@/src/utils/TodoListColumn'

type CategoryMultipleProps = {
  value: TaskCategory[]
  onChange: (categories: TaskCategory[]) => void
}

const getCategoryValue = (category: TaskCategory) => {
  return JSON.stringify(category)
}

const parseCategoryValue = (value: string) => {
  try {
    return normalizeTaskCategories([JSON.parse(value) as TaskCategory])[0] ?? null
  } catch {
    return normalizeTaskCategories([{ label: value }])[0] ?? null
  }
}

export default function CategoryMultiple({ value, onChange }: CategoryMultipleProps) {
  const [customOptions, setCustomOptions] = React.useState<TaskCategory[]>([])
  const [customCategory, setCustomCategory] = React.useState('')

  const availableCategoryOptions = React.useMemo(
    () =>
      normalizeTaskCategories([...defaultCategoryOptions, ...customOptions, ...value]).sort(
        (left, right) => left.label.localeCompare(right.label)
      ),
    [customOptions, value]
  )

  const renderCategoryValue = () => {
    return value.length > 0
      ? value.map((category) => category.label).join(', ')
      : 'Select categories'
  }

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const nextValue = event.target.value
    const nextCategories = (typeof nextValue === 'string' ? nextValue.split(',') : nextValue)
      .map((categoryValue) => parseCategoryValue(categoryValue))
      .filter((category): category is TaskCategory => category !== null)

    onChange(normalizeTaskCategories(nextCategories))
  }

  const handleCustomCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(event.target.value)
  }

  const addCustomCategory = () => {
    const normalizedCategory = customCategory.trim()

    if (!normalizedCategory) {
      return
    }

    const nextCategory: TaskCategory = {
      label: normalizedCategory,
      color: defaultCategoryColor
    }

    setCustomOptions((current) => normalizeTaskCategories([...current, nextCategory]))
    onChange(normalizeTaskCategories([...value, nextCategory]))
    setCustomCategory('')
  }

  const handleCustomCategoryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addCustomCategory()
    }
  }

  return (
    <>
      <Select
        required
        multiple
        displayEmpty
        fullWidth
        value={value.map(getCategoryValue)}
        onChange={handleCategoryChange}
        renderValue={renderCategoryValue}
      >
        {availableCategoryOptions.map((option) => (
          <MenuItem key={option.label} value={getCategoryValue(option)}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Chip
                label={option.label}
                size="small"
                sx={{
                  backgroundColor: option.color,
                  color: '#ffffff'
                }}
              />
            </Stack>
          </MenuItem>
        ))}
      </Select>
      <Stack direction="row" spacing={1.5}>
        <TextField
          fullWidth
          label="Custom category"
          name="customCategory"
          value={customCategory}
          onChange={handleCustomCategoryChange}
          onKeyDown={handleCustomCategoryKeyDown}
        />
        <Button variant="outlined" onClick={addCustomCategory}>
          Add
        </Button>
      </Stack>
    </>
  )
}
