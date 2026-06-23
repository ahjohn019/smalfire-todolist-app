'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import AccountCircle from '@mui/icons-material/AccountCircle'

type NavBarProps = {
  actions?: React.ReactNode
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function InputWithIcon({ actions, searchQuery, onSearchChange }: NavBarProps) {
  const textFieldId = React.useId()

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        py: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          gap: 3,
          alignItems: 'center'
        }}
      >
        <TextField
          color="primary"
          fullWidth
          id={`${textFieldId}-input`}
          placeholder="Search Summary"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle color="primary" />
                </InputAdornment>
              )
            }
          }}
          variant="outlined"
        />
        {actions}
      </Box>
    </Box>
  )
}
