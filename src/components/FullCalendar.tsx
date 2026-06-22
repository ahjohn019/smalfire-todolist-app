'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import Calendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import themePlugin from '@fullcalendar/react/themes/monarch'

import { categoryColorOptions } from '@/src/utils/CategoryMultiple'
import {
  getServerStoredTasksSnapshot,
  saveStoredTasks,
  getStoredTasksSnapshot,
  parseStoredTasks,
  subscribeToStoredTasks
} from '@/src/utils/Storage'
import type { TaskCard } from '@/src/utils/TodoListColumn'
import { initialColumns } from '@/src/utils/TodoListColumn'

export type FullCalendarProps = {
  tasks?: TaskCard[]
  hideHeader?: boolean
}

const priorityColorMap: Record<TaskCard['priority'], string> = {
  High: '#dc2626',
  Medium: '#f59e0b',
  Low: '#16a34a'
}

export default function FullCalendar({ tasks: tasksProp }: FullCalendarProps) {
  const theme = useTheme()
  const [categoryMenuAnchor, setCategoryMenuAnchor] = React.useState<HTMLElement | null>(null)
  const [activeCategoryLabel, setActiveCategoryLabel] = React.useState<string | null>(null)
  const storedTasksSnapshot = React.useSyncExternalStore(
    subscribeToStoredTasks,
    getStoredTasksSnapshot,
    getServerStoredTasksSnapshot
  )

  const storedTasks = React.useMemo(
    () => parseStoredTasks(storedTasksSnapshot, initialColumns.tasks),
    [storedTasksSnapshot]
  )
  const tasks = tasksProp ?? storedTasks

  const handleOpenCategoryMenu = (event: React.MouseEvent<HTMLElement>, categoryLabel: string) => {
    event.stopPropagation()
    setActiveCategoryLabel(categoryLabel)
    setCategoryMenuAnchor(event.currentTarget)
  }

  const handleCloseCategoryMenu = () => {
    setActiveCategoryLabel(null)
    setCategoryMenuAnchor(null)
  }

  const handleCategoryColorChange = (categoryLabel: string, color: string) => {
    const baseTasks = storedTasks.length > 0 ? storedTasks : tasks
    const normalizedCategoryLabel = categoryLabel.toLowerCase()
    const nextTasks = baseTasks.map((task) => ({
      ...task,
      categories: task.categories.map((category) =>
        category.label.toLowerCase() === normalizedCategoryLabel
          ? {
              ...category,
              color
            }
          : category
      )
    }))

    saveStoredTasks(nextTasks)
    handleCloseCategoryMenu()
  }

  const events = React.useMemo(
    () =>
      tasks
        .filter((task) => task.due)
        .map((task) => {
          const eventColor = task.categories[0]?.color ?? priorityColorMap[task.priority]

          return {
            id: String(task.id),
            title: task.title,
            date: task.due,
            backgroundColor: eventColor,
            borderColor: eventColor,
            textColor: '#ffffff',
            extendedProps: {
              assignee: task.assignee,
              status: task.status
            }
          }
        }),
    [tasks]
  )

  return (
    <Paper elevation={0}>
      <Calendar
        plugins={[dayGridPlugin, themePlugin]}
        initialView="dayGridMonth"
        colorScheme={theme.palette.mode}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={events}
        eventContent={(eventInfo) => {
          const task = tasks.find((candidate) => String(candidate.id) === eventInfo.event.id)

          return (
            <Box sx={{ display: 'grid', gap: 0.5, p: 0.25 }}>
              <Typography
                sx={{
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  lineHeight: 1.2
                }}
              >
                {eventInfo.event.title}
              </Typography>
              {task?.categories.length ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {task.categories.map((category) => (
                    <Box
                      component="button"
                      type="button"
                      key={`${task.id}-${category.label}`}
                      onClick={(event: React.MouseEvent<HTMLElement>) =>
                        handleOpenCategoryMenu(event, category.label)
                      }
                      sx={{
                        appearance: 'none',
                        backgroundColor: category.color,
                        border: 'none',
                        borderRadius: 999,
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        maxWidth: '100%',
                        textAlign: 'left',
                        px: 0.75,
                        py: 0.375
                      }}
                    >
                      {category.label}
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Box>
          )
        }}
        dayMaxEvents={2}
        fixedWeekCount={false}
        height="auto"
      />
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
                ? handleCategoryColorChange(activeCategoryLabel, colorOption.value)
                : undefined
            }
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: colorOption.value,
                border: '1px solid rgba(15, 23, 42, 0.18)',
                mr: 1
              }}
            />
            {colorOption.label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  )
}
