'use client'

import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import type { TaskCard } from '@/src/utils/TodoListColumn'
import ReportModal from '@/src/components/ReportModal'
import type { ReportFormat } from '@/src/utils/Report'

export type ReportDropdownProps = {
  onExport?: (format: ReportFormat) => void
  onImport?: (tasks: TaskCard[]) => void
}

export default function ReportDropdown({ onExport, onImport }: ReportDropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [reportMode, setReportMode] = React.useState<'import' | 'export' | null>(null)
  const open = Boolean(anchorEl)
  const modalOpen = reportMode !== null

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseModal = () => {
    setReportMode(null)
  }

  const handleExport = () => {
    setReportMode('export')
    handleClose()
  }

  const handleImportClick = () => {
    setReportMode('import')
    handleClose()
  }

  return (
    <>
      <IconButton
        aria-label="Open report actions"
        aria-controls={open ? 'report-actions-menu' : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        size="small"
        onClick={handleOpen}
        sx={{ mr: -1 }}
      >
        <MoreHorizOutlinedIcon color="action" fontSize="small" />
      </IconButton>
      <Menu
        id="report-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleImportClick}>Import</MenuItem>
        <MenuItem onClick={handleExport}>Export</MenuItem>
      </Menu>
      <ReportModal
        mode={reportMode}
        open={modalOpen}
        onClose={handleCloseModal}
        onExport={(format) => onExport?.(format)}
        onImport={(tasks) => onImport?.(tasks)}
      />
    </>
  )
}
