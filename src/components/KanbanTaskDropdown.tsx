'use client'

import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'

type KanbanTaskDropdownProps = {
  taskId: number
  taskTitle: string
  onDelete?: (taskId: number) => void
  onEdit?: (taskId: number) => void
}

export default function KanbanTaskDropdown({
  taskId,
  taskTitle,
  onDelete,
  onEdit
}: KanbanTaskDropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit?.(taskId)
    handleClose()
  }

  const handleDelete = () => {
    onDelete?.(taskId)
    handleClose()
  }

  return (
    <>
      <IconButton
        aria-label={`Open actions for ${taskTitle}`}
        aria-controls={open ? `task-actions-menu-${taskId}` : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        size="small"
        onClick={handleOpen}
        sx={{ mt: -0.5, mr: -1 }}
      >
        <MoreHorizOutlinedIcon fontSize="small" />
      </IconButton>
      <Menu
        id={`task-actions-menu-${taskId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  )
}
