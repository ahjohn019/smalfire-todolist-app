import type { SelectChangeEvent } from '@mui/material/Select'

const defaultCardsPerPage = 2

const paginationSx = {
  display: 'flex',
  justifyContent: 'center',
  px: 2,
  pb: 2,
  '& .MuiPagination-ul': {
    flexWrap: 'nowrap'
  }
}

const getNextPage = (newPage: number) => newPage

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
