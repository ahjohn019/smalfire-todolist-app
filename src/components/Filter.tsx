'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import type { SelectChangeEvent } from '@mui/material/Select'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import type { DueDateSortOrder, TaskFilters } from '@/src/hooks/useFilter'
type FilterProps = {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
}

export default function Filter({ filters, onChange }: FilterProps) {
  const [open, setOpen] = React.useState(false)
  const [draftFilters, setDraftFilters] = React.useState(filters)

  const handleFilterChange =
    (key: keyof TaskFilters) => (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setDraftFilters({
        ...draftFilters,
        [key]: checked
      })
    }

  const handleOpen = () => {
    setDraftFilters(filters)
    setOpen(true)
  }

  const handleClose = () => {
    setDraftFilters(filters)
    setOpen(false)
  }

  const handleApplyFilters = () => {
    onChange(draftFilters)
    setOpen(false)
  }

  const handleSortChange = (event: SelectChangeEvent<DueDateSortOrder>) => {
    setDraftFilters({
      ...draftFilters,
      dueDateSort: event.target.value as DueDateSortOrder
    })
  }

  return (
    <>
      <Button
        color="primary"
        startIcon={<TuneRoundedIcon />}
        sx={{ minWidth: { xs: 108, sm: 124 }, borderRadius: 999 }}
        variant="outlined"
        onClick={handleOpen}
      >
        Filter
      </Button>

      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: 280, sm: 340 },
            height: '100%',
            px: 3,
            py: 4,
            backgroundColor: 'background.paper'
          }}
        >
          <Typography sx={{ fontWeight: 700 }} variant="h6">
            Task Filters
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
            Filter controls can live here as the board grows.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="due-date-sort-label">Due date order</InputLabel>
              <Select
                label="Due date order"
                labelId="due-date-sort-label"
                value={draftFilters.dueDateSort}
                onChange={handleSortChange}
              >
                <MenuItem value="none">Default order</MenuItem>
                <MenuItem value="ascending">Ascending</MenuItem>
                <MenuItem value="descending">Descending</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={draftFilters.showIncomplete}
                  onChange={handleFilterChange('showIncomplete')}
                />
              }
              label="Show incomplete tasks"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={draftFilters.showComplete}
                  onChange={handleFilterChange('showComplete')}
                />
              }
              label="Show completed tasks"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={draftFilters.highPriorityOnly}
                  onChange={handleFilterChange('highPriorityOnly')}
                />
              }
              label="High priority only"
            />
          </Stack>

          <Button fullWidth sx={{ mt: 4 }} variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </>
  )
}
