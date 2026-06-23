'use client'

import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import EditTaskForm from '@/src/components/EditTaskForm'
import type { EditTaskFormValues } from '@/src/components/EditTaskForm'
import FullCalendar from '@/src/components/FullCalendar'
import { useFilter } from '@/src/hooks/useFilter'
import type { TaskFilters } from '@/src/hooks/useFilter'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@/src/components/Modal'
import NewTaskButton from '@/src/components/NewTaskButton'
import type { NewTaskFormValues } from '@/src/components/NewTaskForm'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import ReportDropdown from '@/src/components/ReportDropdown'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import type { SelectChangeEvent } from '@mui/material/Select'
import KanbanTaskDropdown from '@/src/components/KanbanTaskDropdown'
import { usePagination } from '@/src/hooks/usePagination'
import { useStorage } from '@/src/hooks/useStorage'
import { useReport } from '@/src/hooks/useReport'
import type { ReportFormat } from '@/src/hooks/useReport'
import {
  useTodoListColumn,
  type KanbanColumn,
  type Priority,
  type TaskCard
} from '@/src/hooks/useTodoListColumn'

type KanbanTemplateProps = {
  filters: TaskFilters
  searchQuery: string
}

const priorityColorMap: Record<Priority, 'error' | 'warning' | 'success'> = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
}

const statusColorMap: Record<TaskCard['status'], 'default' | 'success'> = {
  Complete: 'success',
  Incomplete: 'default'
}

export default function KanbanTemplate({ filters, searchQuery }: KanbanTemplateProps) {
  const { getFilteredTasks } = useFilter()
  const {
    defaultCardsPerPage,
    getMaxPage,
    getNextCardsPerPage,
    getNextPage,
    getSafePage,
    getVisibleItems,
    paginationSx
  } = usePagination()
  const {
    getNextTaskId,
    getServerStoredTasksSnapshot,
    getStoredTasksSnapshot,
    parseStoredTasks,
    saveStoredTasks,
    subscribeToStoredTasks
  } = useStorage()
  const { exportTasksToCsv, exportTasksToXlsx } = useReport()
  const { initialColumns } = useTodoListColumn()
  const storedTasksSnapshot = React.useSyncExternalStore(
    subscribeToStoredTasks,
    getStoredTasksSnapshot,
    getServerStoredTasksSnapshot
  )
  const persistedTasks = React.useMemo(
    () => parseStoredTasks(storedTasksSnapshot, initialColumns.tasks),
    [initialColumns.tasks, parseStoredTasks, storedTasksSnapshot]
  )
  const [taskOverrides, setTaskOverrides] = React.useState<TaskCard[] | null>(null)

  const [page, setPage] = React.useState(0)
  const [cardsPerPage, setCardsPerPage] = React.useState(defaultCardsPerPage)
  const [editingTask, setEditingTask] = React.useState<TaskCard | null>(null)
  const [viewMode, setViewMode] = React.useState<'todo' | 'calendar'>('todo')
  const tasks = taskOverrides ?? persistedTasks
  const columnData: KanbanColumn = {
    ...initialColumns,
    tasks
  }

  React.useEffect(() => {
    if (!taskOverrides) {
      return
    }

    saveStoredTasks(taskOverrides)
  }, [saveStoredTasks, taskOverrides])

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(getNextPage(newPage - 1))
  }

  const handleChangeCardsPerPage = (event: SelectChangeEvent) => {
    setCardsPerPage(getNextCardsPerPage(event))
    setPage(0)
  }

  const handleChangeViewMode = (
    _event: React.MouseEvent<HTMLElement>,
    nextViewMode: 'todo' | 'calendar' | null
  ) => {
    if (!nextViewMode) {
      return
    }

    setViewMode(nextViewMode)
  }

  const handleEditTask = (taskId: number) => {
    const selectedTask = columnData.tasks.find((task) => task.id === taskId)

    if (!selectedTask) {
      return
    }

    setEditingTask(selectedTask)
  }

  const handleCloseEditTask = () => {
    setEditingTask(null)
  }

  const handleUpdateTask = (updatedTask: EditTaskFormValues) => {
    setTaskOverrides((current) => {
      const baseTasks = current ?? tasks
      const editingTaskId = editingTask?.id

      return baseTasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              ...updatedTask
            }
          : task
      )
    })
  }

  const handleDeleteTask = (taskId: number) => {
    setTaskOverrides((current) => (current ?? tasks).filter((task) => task.id !== taskId))
  }

  const handleCategoryColorChange = (taskId: number, categoryLabel: string, color: string) => {
    const normalizedCategoryLabel = categoryLabel.toLowerCase()

    setTaskOverrides((current) =>
      (current ?? tasks).map((task) => ({
        ...task,
        categories:
          task.id === taskId
            ? task.categories.map((category) =>
                category.label.toLowerCase() === normalizedCategoryLabel
                  ? {
                      ...category,
                      color
                    }
                  : category
              )
            : task.categories
      }))
    )
  }

  const handleTaskCreated = (newTask: NewTaskFormValues) => {
    setTaskOverrides((current) => {
      const baseTasks = current ?? tasks
      const nextTaskId = getNextTaskId(baseTasks)

      return [
        {
          id: nextTaskId,
          ...newTask
        },
        ...baseTasks
      ]
    })
  }

  const handleExportTasks = (format: ReportFormat) => {
    if (format === 'csv') {
      exportTasksToCsv(tasks)
      return
    }

    exportTasksToXlsx(tasks)
  }

  const handleImportTasks = (importedTasks: TaskCard[]) => {
    if (importedTasks.length === 0) {
      return
    }

    setTaskOverrides(importedTasks)
    setPage(0)
  }

  const filteredTasks = getFilteredTasks(columnData.tasks, filters, searchQuery)
  const maxPage = getMaxPage(filteredTasks, cardsPerPage)
  const safePage = getSafePage(page, maxPage)
  const visibleTasks = getVisibleItems(filteredTasks, safePage, cardsPerPage)

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Stack spacing={2} sx={{ p: 2 }}>
              <Stack
                direction="column"
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  width: '100%'
                }}
              >
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
                        color: columnData.accent,
                        backgroundColor: `${columnData.accent}1a`
                      }}
                    >
                      {columnData.icon}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700 }}>{columnData.title}</Typography>
                      <Chip label={String(filteredTasks.length)} color="primary" size="small" />
                    </Box>
                  </Stack>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={viewMode}
                    onChange={handleChangeViewMode}
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
                {viewMode === 'todo' ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center'
                    }}
                  >
                    <Stack spacing={0.5} sx={{ minWidth: 92 }}>
                      <Typography color="text.secondary" variant="caption">
                        Tasks
                      </Typography>
                      <Select
                        size="small"
                        value={String(cardsPerPage)}
                        onChange={handleChangeCardsPerPage}
                        sx={{
                          height: 25,
                          borderRadius: 2
                        }}
                      >
                        {[2, 4, 6].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                    <ReportDropdown onExport={handleExportTasks} onImport={handleImportTasks} />
                  </Stack>
                ) : (
                  <Stack direction="row" sx={{ justifyContent: 'flex-end', width: '100%' }}>
                    <ReportDropdown onExport={handleExportTasks} onImport={handleImportTasks} />
                  </Stack>
                )}
              </Stack>

              {viewMode === 'todo' ? (
                <Stack spacing={1.5} sx={{ height: 550, overflowX: 'hidden', overflowY: 'auto' }}>
                  {visibleTasks.map((task) => (
                    <Paper
                      key={task.id}
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.default'
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ width: '100%', alignItems: 'flex-start' }}
                          >
                            <Typography sx={{ flex: 1, fontWeight: 600, pr: 1 }}>
                              {task.title}
                            </Typography>
                            <Chip
                              color={priorityColorMap[task.priority]}
                              label={task.priority}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              color={statusColorMap[task.status]}
                              label={task.status}
                              size="small"
                              variant="outlined"
                            />
                            <KanbanTaskDropdown
                              taskId={task.id}
                              taskTitle={task.title}
                              onEdit={handleEditTask}
                              onDelete={handleDeleteTask}
                            />
                          </Stack>
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                          {task.summary}
                        </Typography>
                        {task.categories.length > 0 ? (
                          <Stack
                            direction="row"
                            spacing={0.75}
                            useFlexGap
                            sx={{ flexWrap: 'wrap' }}
                          >
                            {task.categories.map((category) => (
                              <Chip
                                key={`${task.id}-${category.label}`}
                                label={category.label}
                                size="small"
                                variant="filled"
                                sx={{
                                  backgroundColor: category.color,
                                  color: '#ffffff'
                                }}
                              />
                            ))}
                          </Stack>
                        ) : null}
                        <Stack
                          direction="row"
                          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            {task.assignee ? (
                              <Chip label={task.assignee} size="small" variant="filled" />
                            ) : null}

                            <Typography color="text.secondary" variant="caption">
                              {task.due}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <FullCalendar
                  tasks={filteredTasks}
                  hideHeader
                  onCategoryColorChange={handleCategoryColorChange}
                />
              )}
            </Stack>

            <NewTaskButton onCreateTask={handleTaskCreated} />

            {viewMode === 'todo' ? (
              <Box sx={paginationSx}>
                <Pagination
                  color="primary"
                  count={maxPage + 1}
                  onChange={handleChangePage}
                  page={safePage + 1}
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            ) : null}
          </Paper>
        </Box>
        <Modal
          open={Boolean(editingTask)}
          onClose={handleCloseEditTask}
          title={editingTask ? `Edit ${editingTask.title}` : 'Edit Task'}
        >
          {editingTask ? (
            <EditTaskForm
              key={editingTask.id}
              initialValues={editingTask}
              onCancel={handleCloseEditTask}
              onSubmit={handleUpdateTask}
            />
          ) : null}
        </Modal>
      </Stack>
    </Box>
  )
}
