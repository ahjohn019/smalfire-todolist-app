'use client'

import Chip from '@mui/material/Chip'
import FullCalendar from '@/src/components/FullCalendar'
import KanbanTaskDropdown from '@/src/components/KanbanTaskDropdown'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Priority, TaskCard } from '@/src/hooks/useTodoListColumn'

type KanbanToDoTaskListsProps = {
  filteredTasks: TaskCard[]
  onCategoryColorChange: (taskId: number, categoryLabel: string, color: string) => void
  onDeleteTask: (taskId: number) => void
  onEditTask: (taskId: number) => void
  statusColorMap: Record<TaskCard['status'], 'default' | 'success'>
  priorityColorMap: Record<Priority, 'error' | 'warning' | 'success'>
  viewMode: 'todo' | 'calendar'
  visibleTasks: TaskCard[]
}

export default function KanbanToDoTaskLists({
  filteredTasks,
  onCategoryColorChange,
  onDeleteTask,
  onEditTask,
  statusColorMap,
  priorityColorMap,
  viewMode,
  visibleTasks
}: KanbanToDoTaskListsProps) {
  if (viewMode === 'todo') {
    return (
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
                <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
                  <Typography sx={{ flex: 1, fontWeight: 600, pr: 1 }}>{task.title}</Typography>
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
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </Stack>
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {task.summary}
              </Typography>
              {task.categories.length > 0 ? (
                <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
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
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
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
    )
  }

  return (
    <FullCalendar
      tasks={filteredTasks}
      hideHeader
      onCategoryColorChange={onCategoryColorChange}
    />
  )
}
