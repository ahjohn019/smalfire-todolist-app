'use client'

import MenuItem from '@mui/material/MenuItem'
import ReportDropdown from '@/src/components/ReportDropdown'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ReportFormat } from '@/src/hooks/useReport'
import type { TaskCard } from '@/src/hooks/useTodoListColumn'

type KanbanNumberTaskListDropdownProps = {
  cardsPerPage: number
  onChangeCardsPerPage: (event: SelectChangeEvent) => void
  onExport: (format: ReportFormat) => void
  onImport: (tasks: TaskCard[]) => void
  viewMode: 'todo' | 'calendar'
}

export default function KanbanNumberTaskListDropdown({
  cardsPerPage,
  onChangeCardsPerPage,
  onExport,
  onImport,
  viewMode
}: KanbanNumberTaskListDropdownProps) {
  if (viewMode === 'todo') {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Stack spacing={0.5} sx={{ minWidth: 92 }}>
          <Typography color="text.secondary" variant="caption">
            Tasks
          </Typography>
          <Select
            size="small"
            value={String(cardsPerPage)}
            onChange={onChangeCardsPerPage}
            sx={{
              height: 25,
              borderRadius: 2
            }}
          >
            {[2, 4, 6].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <ReportDropdown onExport={onExport} onImport={onImport} />
      </Stack>
    )
  }

  return (
    <Stack direction="row" sx={{ justifyContent: 'flex-end', width: '100%' }}>
      <ReportDropdown onExport={onExport} onImport={onImport} />
    </Stack>
  )
}
