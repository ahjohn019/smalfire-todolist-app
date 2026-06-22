import type { TaskCard } from '@/src/utils/TodoListColumn'

export type DueDateSortOrder = 'none' | 'ascending' | 'descending'

export type TaskFilters = {
  dueDateSort: DueDateSortOrder
  highPriorityOnly: boolean
  showComplete: boolean
  showIncomplete: boolean
}

export const defaultTaskFilters: TaskFilters = {
  dueDateSort: 'none',
  highPriorityOnly: false,
  showComplete: true,
  showIncomplete: true
}

const toLocalDateTimestamp = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

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

const getDueDateTimestamp = (due: string) => {
  if (!due) {
    return null
  }

  if (due === 'Today') {
    return toLocalDateTimestamp(new Date())
  }

  const monthDayMatch = due.match(/^([A-Z][a-z]{2}) (\d{1,2})$/)

  if (monthDayMatch) {
    const [, monthLabel, dayValue] = monthDayMatch
    const monthIndex = monthIndexByLabel[monthLabel]

    if (monthIndex !== undefined) {
      return toLocalDateTimestamp(new Date(new Date().getFullYear(), monthIndex, Number(dayValue)))
    }
  }

  const parsedDate = new Date(due)

  return toLocalDateTimestamp(parsedDate)
}

const matchesTaskSearch = (task: TaskCard, searchQuery: string): boolean => {
  if (!searchQuery) return true

  return task.summary.toLowerCase().includes(searchQuery)
}

const matchesTaskStatus = (task: TaskCard, filters: TaskFilters): boolean => {
  const hasStatusFilter = filters.showComplete || filters.showIncomplete

  if (!hasStatusFilter) return true

  return (
    (filters.showComplete && task.status === 'Complete') ||
    (filters.showIncomplete && task.status === 'Incomplete')
  )
}

const matchesTaskPriority = (task: TaskCard, filters: TaskFilters): boolean => {
  if (!filters.highPriorityOnly) return true

  return task.priority === 'High'
}

const sortTasksByDueDate = (tasks: TaskCard[], direction: 1 | -1): TaskCard[] => {
  return [...tasks].sort((leftTask, rightTask) => {
    const leftDueTimestamp = getDueDateTimestamp(leftTask.due)
    const rightDueTimestamp = getDueDateTimestamp(rightTask.due)

    if (leftDueTimestamp === null && rightDueTimestamp === null) {
      return leftTask.id - rightTask.id
    }

    if (leftDueTimestamp === null) return 1
    if (rightDueTimestamp === null) return -1

    if (leftDueTimestamp === rightDueTimestamp) {
      return leftTask.id - rightTask.id
    }

    return (leftDueTimestamp - rightDueTimestamp) * direction
  })
}

export const getFilteredTasks = (
  tasks: TaskCard[],
  filters: TaskFilters,
  searchQuery: string
): TaskCard[] => {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const filteredTasks = tasks.filter(
    (task) =>
      matchesTaskSearch(task, normalizedSearchQuery) &&
      matchesTaskStatus(task, filters) &&
      matchesTaskPriority(task, filters)
  )

  if (filters.dueDateSort === 'none') {
    return filteredTasks
  }

  const direction = filters.dueDateSort === 'ascending' ? 1 : -1

  return sortTasksByDueDate(filteredTasks, direction)
}
