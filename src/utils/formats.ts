import dayjs from 'dayjs'

export const formatDate = (date: string, format = 'DD/MM/YYYY') => {
	return dayjs(date).format(format)
}

export const formatCurrency = (amount: number | string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(Number(amount))
}
