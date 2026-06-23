import * as XLSX from 'xlsx'
import {
  useTodoListColumn,
  type Priority,
  type TaskCard,
  type TaskStatus
} from '@/src/hooks/useTodoListColumn'

type ImportedCellValue = string | number | boolean | Date | null | ImportedCellValue[]

type ImportedTaskRow = Record<string, ImportedCellValue>
export type ReportFormat = 'csv' | 'xlsx'

const importedPriorityOptions: Priority[] = ['High', 'Medium', 'Low']
const importedStatusOptions: TaskStatus[] = ['Complete', 'Incomplete']

const getImportedRowValue = (row: ImportedTaskRow, key: string) => {
  const matchedKey = Object.keys(row).find((rowKey) => rowKey.trim().toLowerCase() === key)

  return matchedKey ? row[matchedKey] : null
}

const normalizeImportedString = (value: ImportedCellValue) => String(value ?? '').trim()

const normalizeImportedCategories = (
  value: ImportedCellValue,
  normalizeTaskCategories: ReturnType<typeof useTodoListColumn>['normalizeTaskCategories']
) => {
  if (Array.isArray(value)) {
    return normalizeTaskCategories(
      value.map((category) => ({
        label: normalizeImportedString(category)
      }))
    )
  }

  const normalizedValue = normalizeImportedString(value)

  if (!normalizedValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(normalizedValue) as ImportedCellValue

    if (Array.isArray(parsedValue)) {
      return normalizeTaskCategories(
        parsedValue as Array<string | { label?: string; color?: string }>
      )
    }
  } catch {}

  return normalizeTaskCategories(
    normalizedValue.split(',').map((category) => ({
      label: category.trim()
    }))
  )
}

const normalizeImportedPriority = (value: ImportedCellValue): Priority => {
  const normalizedValue = normalizeImportedString(value)

  return importedPriorityOptions.includes(normalizedValue as Priority)
    ? (normalizedValue as Priority)
    : 'Medium'
}

const normalizeImportedStatus = (value: ImportedCellValue): TaskStatus => {
  const normalizedValue = normalizeImportedString(value)

  return importedStatusOptions.includes(normalizedValue as TaskStatus)
    ? (normalizedValue as TaskStatus)
    : 'Incomplete'
}

const normalizeImportedDueDate = (value: ImportedCellValue): string => {
  const parsedDate = XLSX.SSF.parse_date_code(value)

  if (parsedDate) {
    return `${parsedDate.y}-${String(parsedDate.m).padStart(2, '0')}-${String(parsedDate.d).padStart(2, '0')}`
  }

  return normalizeImportedString(value)
}

const mapImportedRowsToTasks = (
  rows: ImportedTaskRow[],
  normalizeTaskCategories: ReturnType<typeof useTodoListColumn>['normalizeTaskCategories']
): TaskCard[] =>
  rows
    .map((row, index) => {
      const title = normalizeImportedString(getImportedRowValue(row, 'title'))

      if (!title) {
        return null
      }

      return {
        id: index + 1,
        title,
        summary: normalizeImportedString(getImportedRowValue(row, 'summary')),
        categories: normalizeImportedCategories(
          getImportedRowValue(row, 'categories'),
          normalizeTaskCategories
        ),
        priority: normalizeImportedPriority(getImportedRowValue(row, 'priority')),
        status: normalizeImportedStatus(getImportedRowValue(row, 'status')),
        assignee: normalizeImportedString(getImportedRowValue(row, 'assignee')),
        due: normalizeImportedDueDate(getImportedRowValue(row, 'due'))
      }
    })
    .filter((task): task is TaskCard => task !== null)

const mapTasksToExportRows = (tasks: TaskCard[]) =>
  tasks.map((task) => ({
    title: task.title,
    summary: task.summary,
    categories: JSON.stringify(task.categories),
    priority: task.priority,
    status: task.status,
    assignee: task.assignee,
    due: task.due
  }))

const importTasksFromWorkbook = async (
  file: File,
  normalizeTaskCategories: ReturnType<typeof useTodoListColumn>['normalizeTaskCategories']
): Promise<TaskCard[]> => {
  const fileBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(fileBuffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const firstSheet = workbook.Sheets[firstSheetName]

  if (!firstSheet) {
    return []
  }

  const rows = XLSX.utils.sheet_to_json<ImportedTaskRow>(firstSheet, { defval: '' })

  return mapImportedRowsToTasks(rows, normalizeTaskCategories)
}

const importTasksFromFile = async (
  file: File,
  normalizeTaskCategories: ReturnType<typeof useTodoListColumn>['normalizeTaskCategories']
): Promise<TaskCard[]> => {
  return importTasksFromWorkbook(file, normalizeTaskCategories)
}

const exportTasksToCsv = (tasks: TaskCard[]) => {
  const worksheet = XLSX.utils.json_to_sheet(mapTasksToExportRows(tasks))
  const csvContent = XLSX.utils.sheet_to_csv(worksheet)
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const downloadUrl = URL.createObjectURL(csvBlob)
  const link = document.createElement('a')

  link.href = downloadUrl
  link.download = 'tasks.csv'
  link.click()

  URL.revokeObjectURL(downloadUrl)
}

const exportTasksToXlsx = (tasks: TaskCard[]) => {
  const worksheet = XLSX.utils.json_to_sheet(mapTasksToExportRows(tasks))
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks')
  XLSX.writeFile(workbook, 'tasks.xlsx')
}

export const useReport = () => {
  const { normalizeTaskCategories } = useTodoListColumn()

  return {
    importTasksFromWorkbook: (file: File) => importTasksFromWorkbook(file, normalizeTaskCategories),
    importTasksFromFile: (file: File) => importTasksFromFile(file, normalizeTaskCategories),
    exportTasksToCsv,
    exportTasksToXlsx
  }
}
