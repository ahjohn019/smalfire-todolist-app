'use client'

import * as React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useCategoryMultiple } from '@/src/hooks/useCategoryMultiple'
import { useTodoListColumn, type TaskCategory } from '@/src/hooks/useTodoListColumn'

type CategoryMultipleProps = {
  value: TaskCategory[]
  onChange: (categories: TaskCategory[]) => void
}

export default function CategoryMultiple({ value, onChange }: CategoryMultipleProps) {
  const { categoryColorOptions, getCategoryValue, parseCategoryValue } = useCategoryMultiple()
  const {
    defaultCategoryColor,
    defaultCategoryOptions,
    getCategoryColor,
    normalizeTaskCategories
  } = useTodoListColumn()
  const [customOptions, setCustomOptions] = React.useState<TaskCategory[]>([])
  const [customCategory, setCustomCategory] = React.useState('')
  const [customCategoryColor, setCustomCategoryColor] = React.useState(defaultCategoryColor)
  const [activeCategoryLabel, setActiveCategoryLabel] = React.useState<string | null>(null)
  const [categoryMenuAnchor, setCategoryMenuAnchor] = React.useState<HTMLElement | null>(null)

  const availableCategoryOptions = React.useMemo(
    () =>
      normalizeTaskCategories([...defaultCategoryOptions, ...customOptions, ...value]).sort(
        (left, right) => left.label.localeCompare(right.label)
      ),
    [customOptions, defaultCategoryOptions, normalizeTaskCategories, value]
  )

  const renderCategoryValue = () => {
    return value.length > 0
      ? value.map((category) => category.label).join(', ')
      : 'Select categories'
  }

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[]
    const categories = value.map(parseCategoryValue)

    onChange(normalizeTaskCategories(categories))
  }

  const handleCustomCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(event.target.value)
  }

  const handleCustomCategoryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategoryColor(event.target.value)
  }

  const handleSelectedCategoryColorChange = (label: string, color: string) => {
    const nextSelectedCategories = value.map((category) =>
      category.label === label
        ? {
            ...category,
            color
          }
        : category
    )

    const nextCustomOptions = customOptions.map((category) =>
      category.label === label
        ? {
            ...category,
            color
          }
        : category
    )

    setCustomOptions(nextCustomOptions)
    onChange(normalizeTaskCategories(nextSelectedCategories))
    setCategoryMenuAnchor(null)
  }

  const handleOpenCategoryMenu = (event: React.MouseEvent<HTMLElement>, label: string) => {
    setActiveCategoryLabel(label)
    setCategoryMenuAnchor(event.currentTarget)
  }

  const handleCloseCategoryMenu = () => {
    setActiveCategoryLabel(null)
    setCategoryMenuAnchor(null)
  }

  const addCustomCategory = () => {
    const normalizedCategory = customCategory.trim()

    if (!normalizedCategory) {
      return
    }

    const nextCategory: TaskCategory = {
      label: normalizedCategory,
      color: customCategoryColor || getCategoryColor(normalizedCategory)
    }

    setCustomOptions((current) => normalizeTaskCategories([...current, nextCategory]))
    onChange(normalizeTaskCategories([...value, nextCategory]))
    setCustomCategory('')
    setCustomCategoryColor(defaultCategoryColor)
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
      {value.length > 0 ? (
        <Stack spacing={1}>
          <Typography color="text.secondary" variant="caption">
            Category colors
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {value.map((category) => (
              <Chip
                key={category.label}
                label={category.label}
                size="small"
                onClick={(event) => handleOpenCategoryMenu(event, category.label)}
                sx={{
                  minWidth: 96,
                  backgroundColor: category.color,
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}
      <Menu
        anchorEl={categoryMenuAnchor}
        open={Boolean(categoryMenuAnchor && activeCategoryLabel)}
        onClose={handleCloseCategoryMenu}
      >
        {categoryColorOptions.map((colorOption) => (
          <MenuItem
            key={colorOption.value}
            onClick={() =>
              activeCategoryLabel
                ? handleSelectedCategoryColorChange(activeCategoryLabel, colorOption.value)
                : undefined
            }
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: colorOption.value,
                  border: '1px solid rgba(15, 23, 42, 0.18)'
                }}
              />
              <span>{colorOption.label}</span>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
      <Stack direction="row" spacing={1.5}>
        <TextField
          fullWidth
          label="Custom category"
          name="customCategory"
          value={customCategory}
          onChange={handleCustomCategoryChange}
          onKeyDown={handleCustomCategoryKeyDown}
        />
        <TextField
          select
          label="Color"
          name="customCategoryColor"
          value={customCategoryColor}
          onChange={handleCustomCategoryColorChange}
          sx={{ minWidth: 180 }}
        >
          {categoryColorOptions.map((colorOption) => (
            <MenuItem key={colorOption.value} value={colorOption.value}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: colorOption.value,
                    border: '1px solid rgba(15, 23, 42, 0.18)'
                  }}
                />
                <span>{colorOption.label}</span>
              </Stack>
            </MenuItem>
          ))}
        </TextField>
        <Button variant="outlined" onClick={addCustomCategory}>
          Add
        </Button>
      </Stack>
    </>
  )
}
