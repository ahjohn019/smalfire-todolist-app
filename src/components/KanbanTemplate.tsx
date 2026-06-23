'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import EditTaskForm from '@/src/components/EditTaskForm'
import type { EditTaskFormValues } from '@/src/components/EditTaskForm'
import KanbanNumberTaskListDropdown from '@/src/components/KanbanNumberTaskListDropdown'
import KanbanToDoTaskLists from '@/src/components/KanbanToDoTaskLists'
import KanbanTitle from '@/src/components/KanbanTitle'
import { useFilter } from '@/src/hooks/useFilter'
import type { TaskFilters } from '@/src/hooks/useFilter'
import Modal from '@/src/components/Modal'
import NewTaskButton from '@/src/components/NewTaskButton'
import type { NewTaskFormValues } from '@/src/components/NewTaskForm'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import type { SelectChangeEvent } from '@mui/material/Select'
import { usePagination } from '@/src/hooks/usePagination'
import { useStorage } from '@/src/hooks/useStorage'
import { useReport } from '@/src/hooks/useReport'
import type { ReportFormat } from '@/src/hooks/useReport'
import { mapTaskcategories } from '@/src/utils/KanbanUtils'
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
            ? mapTaskcategories(task.categories, normalizedCategoryLabel, color)
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
                <KanbanTitle
                  accent={columnData.accent}
                  icon={columnData.icon}
                  taskCount={filteredTasks.length}
                  title={columnData.title}
                  viewMode={viewMode}
                  onChangeViewMode={handleChangeViewMode}
                />
                <KanbanNumberTaskListDropdown
                  cardsPerPage={cardsPerPage}
                  onChangeCardsPerPage={handleChangeCardsPerPage}
                  onExport={handleExportTasks}
                  onImport={handleImportTasks}
                  viewMode={viewMode}
                />
              </Stack>

              <KanbanToDoTaskLists
                filteredTasks={filteredTasks}
                onCategoryColorChange={handleCategoryColorChange}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                priorityColorMap={priorityColorMap}
                statusColorMap={statusColorMap}
                viewMode={viewMode}
                visibleTasks={visibleTasks}
              />
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
