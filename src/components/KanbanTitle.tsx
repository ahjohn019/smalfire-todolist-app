'use client'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import type * as React from 'react'

type KanbanTitleProps = {
  accent: string
  icon: React.ReactNode
  taskCount: number
  title: string
  viewMode: 'todo' | 'calendar'
  onChangeViewMode: (
    event: React.MouseEvent<HTMLElement>,
    nextViewMode: 'todo' | 'calendar' | null
  ) => void
}

export default function KanbanTitle({
  accent,
  icon,
  taskCount,
  title,
  viewMode,
  onChangeViewMode
}: KanbanTitleProps) {
  return (
    <Stack
      direction="row"
      sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2.5,
            display: 'grid',
            placeItems: 'center',
            color: accent,
            backgroundColor: `${accent}1a`
          }}
        >
          {icon}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
          <Chip label={String(taskCount)} color="primary" size="small" />
        </Box>
      </Stack>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={viewMode}
        onChange={onChangeViewMode}
        aria-label="Switch task view"
        sx={{
          gap: 1,
          '& .MuiToggleButton-root': {
            borderRadius: 2,
            px: 1.5,
            textTransform: 'none'
          },
          '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
            borderLeft: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <ToggleButton value="todo" aria-label="To do view">
          To Do
        </ToggleButton>
        <ToggleButton value="calendar" aria-label="Calendar view">
          Calendar
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}
