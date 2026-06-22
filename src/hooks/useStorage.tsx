import { useTodoListColumn, type TaskCard } from '@/src/hooks/useTodoListColumn'

const TODO_LIST_VIEW_STORAGE_KEY = 'to-do-list-view'
const TODO_LIST_VIEW_STORAGE_EVENT = 'to-do-list-storage-change'

const getHighestTaskId = (tasks: TaskCard[]) => {
  const taskIds = tasks.map((task) => task.id)
  return taskIds.length > 0 ? Math.max(...taskIds) : 0
}

const normalizeStoredTasks = (
  tasks: TaskCard[],
  normalizeTaskCategories: ReturnType<typeof useTodoListColumn>['normalizeTaskCategories']
): TaskCard[] => {
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

const subscribeToStoredTasks = (onStoreChange: () => void) => {
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

const getStoredTasksSnapshot = () => {
  try {
    return localStorage.getItem(TODO_LIST_VIEW_STORAGE_KEY)
  } catch {
    return null
  }
}

const getServerStoredTasksSnapshot = () => null

const parseStoredTasks = (
  storedTasks: string | null,
  fallbackTasks: TaskCard[],
  normalizeTaskCategories: ReturnType<typeof useTodoListColumn>['normalizeTaskCategories']
) => {
  if (!storedTasks) {
    return fallbackTasks
  }

  try {
    const parsedTasks = JSON.parse(storedTasks) as TaskCard[]

    return Array.isArray(parsedTasks)
      ? normalizeStoredTasks(parsedTasks, normalizeTaskCategories)
      : fallbackTasks
  } catch {
    return fallbackTasks
  }
}

const getNextTaskId = (tasks: TaskCard[]) => getHighestTaskId(tasks) + 1

const saveStoredTasks = (tasks: TaskCard[]) => {
  localStorage.setItem(TODO_LIST_VIEW_STORAGE_KEY, JSON.stringify(tasks))
  dispatchEvent(new Event(TODO_LIST_VIEW_STORAGE_EVENT))
}

export const useStorage = () => {
  const { normalizeTaskCategories } = useTodoListColumn()

  return {
    TODO_LIST_VIEW_STORAGE_KEY,
    subscribeToStoredTasks,
    getStoredTasksSnapshot,
    getServerStoredTasksSnapshot,
    parseStoredTasks: (storedTasks: string | null, fallbackTasks: TaskCard[]) =>
      parseStoredTasks(storedTasks, fallbackTasks, normalizeTaskCategories),
    getNextTaskId,
    saveStoredTasks
  }
}
