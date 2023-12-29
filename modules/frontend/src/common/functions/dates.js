import dayjs from 'dayjs'

export const now = () => dayjs()
export const startOfToday = () => now().startOf('day').toDate().toISOString()
export const endOfToday = () => now().endOf('day').toDate().toISOString()