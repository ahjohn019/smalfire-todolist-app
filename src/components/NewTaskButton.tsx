'use client'

import * as React from 'react'
import ButtonBase from '@mui/material/ButtonBase'
import Stack from '@mui/material/Stack'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Modal from '@/src/components/Modal'
import NewTaskForm from '@/src/components/NewTaskForm'
import type { NewTaskFormValues } from '@/src/components/NewTaskForm'

type NewTaskButtonProps = {
  onCreateTask: (values: NewTaskFormValues) => void
}

export default function NewTaskButton({ onCreateTask }: NewTaskButtonProps) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const newTaskTitle = 'Create a new task'

  return (
    <div>
      <ButtonBase
        focusRipple
        onClick={handleOpen}
        sx={{
          width: '100%',
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 0,
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <AddOutlinedIcon fontSize="small" />
          <span>New Task</span>
        </Stack>
      </ButtonBase>
      <Modal
        open={open}
        onClose={handleClose}
        title={newTaskTitle}
        description="Add a few details to create a task."
      >
        <NewTaskForm onCancel={handleClose} onCreateTask={onCreateTask} />
      </Modal>
    </div>
  )
}
