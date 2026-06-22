'use client'

import Box from '@mui/material/Box'
import MuiModal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

type AppModalProps = {
  children: ReactNode
  description?: ReactNode
  open: boolean
  onClose: () => void
  title: ReactNode
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 'calc(100% - 32px)', sm: 420 },
  maxWidth: '100%',
  borderRadius: 3,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
} as const

export default function Modal({ children, description, open, onClose, title }: AppModalProps) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="app-modal-title"
      aria-describedby={description ? 'app-modal-description' : undefined}
    >
      <Box sx={modalStyle}>
        <Typography id="app-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box sx={{ mt: 3 }}>{children}</Box>
      </Box>
    </MuiModal>
  )
}
