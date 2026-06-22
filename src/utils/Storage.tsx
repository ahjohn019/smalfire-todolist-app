import { normalizeTaskCategories, type TaskCard } from '@/src/utils/TodoListColumn'

export const TODO_LIST_VIEW_STORAGE_KEY = 'to-do-list-view'
const TODO_LIST_VIEW_STORAGE_EVENT = 'to-do-list-storage-change'

const getHighestTaskId = (tasks: TaskCard[]) => {
  const taskIds = tasks.map((task) => task.id)
  return taskIds.length > 0 ? Math.max(...taskIds) : 0
}

const normalizeStoredTasks = (tasks: TaskCard[]): TaskCard[] => {
  const seenIds = new Set<number>()
  let nextTaskId = getHighestTaskId(tasks)

  return tasks.map((task) => {
    const replacementId = ++nextTaskId
    seenIds.add(replacementId)

    return {
      ...task,
      categories: normalizeTaskCategories(task.categories),
      id: replacementId
    }
  })
}

export const subscribeToStoredTasks = (onStoreChange: () => void) => {
  try {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === TODO_LIST_VIEW_STORAGE_KEY) {
        onStoreChange()
      }
    }

    const handleCustomStorageChange = () => {
      onStoreChange()
    }

    addEventListener('storage', handleStorageChange)
    addEventListener(TODO_LIST_VIEW_STORAGE_EVENT, handleCustomStorageChange)

    return () => {
      removeEventListener('storage', handleStorageChange)
      removeEventListener(TODO_LIST_VIEW_STORAGE_EVENT, handleCustomStorageChange)
    }
  } catch {
    return () => {}
  }
}

export const getStoredTasksSnapshot = () => {
  try {
    return localStorage.getItem(TODO_LIST_VIEW_STORAGE_KEY)
  } catch {
    return null
  }
}

export const getServerStoredTasksSnapshot = () => null

export const parseStoredTasks = (storedTasks: string | null, fallbackTasks: TaskCard[]) => {
  if (!storedTasks) {
    return fallbackTasks
  }

  try {
    const parsedTasks = JSON.parse(storedTasks) as TaskCard[]

    return Array.isArray(parsedTasks) ? normalizeStoredTasks(parsedTasks) : fallbackTasks
  } catch {
    return fallbackTasks
  }
}

export const getNextTaskId = (tasks: TaskCard[]) => getHighestTaskId(tasks) + 1

export const saveStoredTasks = (tasks: TaskCard[]) => {
  localStorage.setItem(TODO_LIST_VIEW_STORAGE_KEY, JSON.stringify(tasks))
  dispatchEvent(new Event(TODO_LIST_VIEW_STORAGE_EVENT))
}
