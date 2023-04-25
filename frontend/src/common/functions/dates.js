import dayjs from 'dayjs'

export const now = () => dayjs()
export const startOfToday = () => now().startOf('day')
export const endOfToday = () => now().endOf('day')