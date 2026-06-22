'use client'

import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Modal from '@/src/components/Modal'
import type { TaskCard } from '@/src/hooks/useTodoListColumn'
import { useReport } from '@/src/hooks/useReport'
import type { ReportFormat } from '@/src/hooks/useReport'

type ReportModalMode = 'import' | 'export'

type ReportModalProps = {
  mode: ReportModalMode | null
  open: boolean
  onClose: () => void
  onExport: (format: ReportFormat) => void
  onImport: (tasks: TaskCard[]) => void
}

const fileAcceptByFormat: Record<ReportFormat, string> = {
  csv: '.csv',
  xlsx: '.xlsx,.xls'
}

export default function ReportModal({ mode, open, onClose, onExport, onImport }: ReportModalProps) {
  const { importTasksFromFile } = useReport()
  const csvInputRef = React.useRef<HTMLInputElement | null>(null)
  const xlsxInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleSelectFormat = (format: ReportFormat) => {
    if (mode === 'export') {
      onExport(format)
      onClose()
      return
    }

    const inputRef = format === 'csv' ? csvInputRef : xlsxInputRef
    inputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? []

    if (file) {
      try {
        onImport(await importTasksFromFile(file))
        onClose()
      } catch {}
    }

    event.target.value = ''
  }

  return (
    <>
      <input
        ref={csvInputRef}
        hidden
        accept={fileAcceptByFormat.csv}
        type="file"
        onChange={handleFileChange}
      />
      <input
        ref={xlsxInputRef}
        hidden
        accept={fileAcceptByFormat.xlsx}
        type="file"
        onChange={handleFileChange}
      />
      <Modal
        open={open}
        onClose={onClose}
        title={mode === 'import' ? 'Import Tasks' : 'Export Tasks'}
        description={
          <Typography color="text.secondary" variant="body2">
            Choose the file format you want to {mode ?? 'report'}.
          </Typography>
        }
      >
        <Stack spacing={2}>
          <Typography color="text.secondary" variant="body2">
            Choose the file format you want to {mode ?? 'report'}.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button fullWidth variant="outlined" onClick={() => handleSelectFormat('csv')}>
              CSV
            </Button>
            <Button fullWidth variant="contained" onClick={() => handleSelectFormat('xlsx')}>
              XLSX
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  )
}
