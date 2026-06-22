import type { SelectChangeEvent } from '@mui/material/Select'

const defaultCardsPerPage = 2

const paginationSx = {
  borderColor: 'divider',
  '.MuiTablePagination-toolbar': {
    minHeight: 52,
    px: 2,
    justifyContent: 'center',
    gap: 1
  },
  '.MuiTablePagination-spacer': {
    display: 'none'
  },
  '.MuiTablePagination-displayedRows': {
    margin: 0
  },
  '.MuiTablePagination-selectLabel': {
    display: 'none'
  },
  '.MuiTablePagination-input': {
    display: 'none'
  }
}

const getNextPage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
  return newPage
}

const getNextCardsPerPage = (event: SelectChangeEvent) => {
  return Number(event.target.value)
}

const getMaxPage = <T,>(items: T[], rowsPerPage: number) => {
  return items.length > 0 ? Math.floor((items.length - 1) / rowsPerPage) : 0
}

const getSafePage = (page: number, maxPage: number) => {
  return Math.min(page, maxPage)
}

const getVisibleItems = <T,>(items: T[], page: number, rowsPerPage: number) => {
  return items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
}

export const usePagination = () => {
  return {
    defaultCardsPerPage,
    paginationSx,
    getNextPage,
    getNextCardsPerPage,
    getMaxPage,
    getSafePage,
    getVisibleItems
  }
}
